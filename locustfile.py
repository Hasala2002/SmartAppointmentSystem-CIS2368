"""
Lone Star Dental - Load Testing

To run against live API:
    locust --host https://smartappointmentapi.digitalocean.hasala.me

To run headless and export HTML report:
    locust --headless --users 50 --spawn-rate 5 \
           --host https://smartappointmentapi.digitalocean.hasala.me \
           --html load_test_report.html --run-time 3m

Scenarios:
    - BrowseUser      : Anonymous user browsing locations and slots (40% of traffic)
    - CustomerUser    : Registered customer booking appointments (40% of traffic)
    - StaffUser       : Staff managing the queue (20% of traffic)
"""

import random
import string
from datetime import date, timedelta
from locust import HttpUser, task, between, events


# ──────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────

LOCATION_SLUGS = [
    "houston-downtown",
    "houston-galleria",
    "austin-central",
    "austin-round-rock",
    "dallas-uptown",
    "fort-worth-sundance",
]

def random_email():
    suffix = "".join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"loadtest_{suffix}@test.com"

def next_weekday(days_ahead=1):
    """Return a weekday date YYYY-MM-DD that is at least days_ahead from today."""
    target = date.today() + timedelta(days=days_ahead)
    while target.weekday() >= 5:  # skip Saturday (5) and Sunday (6)
        target += timedelta(days=1)
    return target.isoformat()

def pick_time_slot():
    """Return a realistic appointment time string."""
    slots = [
        "09:00", "09:15", "09:30", "09:45",
        "10:00", "10:15", "10:30", "10:45",
        "11:00", "11:15", "11:30", "11:45",
        "12:00", "12:15", "12:30", "12:45",
        "13:00", "13:15", "13:30", "13:45",
        "14:00", "14:15", "14:30", "14:45",
        "15:00", "15:15", "15:30", "15:45",
        "16:00", "16:15", "16:30", "16:45",
    ]
    return random.choice(slots)



# Scenario 1: Anonymous Browse User
# Simulates a visitor browsing the site
# without logging in.
# Weight: 40% of total users

class BrowseUser(HttpUser):
    """
    Represents an anonymous visitor who:
    - Checks the health endpoint
    - Lists all locations
    - Views a specific location by slug
    - Checks available booking slots
    """
    weight = 4
    wait_time = between(1, 4)

    @task(2)
    def list_locations(self):
        self.client.get(
            "/api/v1/locations/",
            name="/api/v1/locations/ [list]"
        )

    @task(3)
    def get_location_by_slug(self):
        slug = random.choice(LOCATION_SLUGS)
        self.client.get(
            f"/api/v1/locations/slug/{slug}",
            name="/api/v1/locations/slug/{slug}"
        )

    @task(3)
    def get_bookable_slots(self):
        res = self.client.get(
            "/api/v1/locations/",
            name="/api/v1/locations/ [for slots]"
        )
        if res.status_code == 200:
            locations = res.json()
            if locations:
                location = random.choice(locations)
                slot_date = next_weekday(random.randint(1, 14))
                self.client.get(
                    "/api/v1/availability/bookable-slots",
                    params={"location_id": location["id"], "date": slot_date},
                    name="/api/v1/availability/bookable-slots"
                )

    @task(1)
    def health_check(self):
        self.client.get("/health", name="/health")


# Scenario 2: Registered Customer User
# Simulates a logged-in patient who
# registers, logs in, books, and manages
# their appointments.
# Weight: 40% of total users


class CustomerUser(HttpUser):
    """
    Represents a registered customer who:
    - Registers a new account
    - Logs in
    - Browses locations and available slots
    - Books an appointment
    - Lists their appointments
    - Views appointment details
    - Occasionally cancels an appointment
    """
    weight = 4
    wait_time = between(2, 6)

    def on_start(self):
        """Register and log in at the start of each simulated user session."""
        self.token = None
        self.appointment_ids = []
        self.location_ids = []

        email = random_email()
        password = "LoadTest123!"
        res = self.client.post(
            "/api/v1/auth/register",
            json={
                "email": email,
                "password": password,
                "first_name": "Load",
                "last_name": "Test",
                "phone": "713-555-0000",
            },
            name="/api/v1/auth/register"
        )

        if res.status_code == 200:
            data = res.json()
            self.token = data.get("access_token")
        else:
            login_res = self.client.post(
                "/api/v1/auth/login",
                json={"email": email, "password": password},
                name="/api/v1/auth/login [fallback]"
            )
            if login_res.status_code == 200:
                self.token = login_res.json().get("access_token")

        loc_res = self.client.get("/api/v1/locations/", name="/api/v1/locations/ [init]")
        if loc_res.status_code == 200:
            self.location_ids = [loc["id"] for loc in loc_res.json()]

    def auth_headers(self):
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    @task(3)
    def browse_locations(self):
        self.client.get(
            "/api/v1/locations/",
            name="/api/v1/locations/ [list]"
        )

    @task(3)
    def check_available_slots(self):
        if not self.location_ids:
            return
        location_id = random.choice(self.location_ids)
        slot_date = next_weekday(random.randint(1, 14))
        self.client.get(
            "/api/v1/availability/bookable-slots",
            params={"location_id": location_id, "date": slot_date},
            name="/api/v1/availability/bookable-slots"
        )

    @task(2)
    def book_appointment(self):
        if not self.token or not self.location_ids:
            return

        location_id = random.choice(self.location_ids)
        slot_date = next_weekday(random.randint(1, 14))
        time_slot = pick_time_slot()
        scheduled_start = f"{slot_date}T{time_slot}:00"

        res = self.client.post(
            "/api/v1/appointments/",
            json={
                "location_id": location_id,
                "scheduled_start": scheduled_start,
                "notes": "Load test appointment",
                "last_dental_visit": random.choice([
                    "within-6-months", "6-12-months", "over-a-year", "never"
                ]),
                "has_dental_pain": random.choice([True, False]),
                "allergies": None,
                "additional_notes": "Automated load test - please ignore",
            },
            headers=self.auth_headers(),
            name="/api/v1/appointments/ [create]"
        )

        if res.status_code == 200:
            appt = res.json()
            self.appointment_ids.append(appt["id"])

    @task(3)
    def list_appointments(self):
        if not self.token:
            return
        self.client.get(
            "/api/v1/appointments/",
            headers=self.auth_headers(),
            name="/api/v1/appointments/ [list]"
        )

    @task(2)
    def view_appointment_detail(self):
        if not self.token or not self.appointment_ids:
            return
        appt_id = random.choice(self.appointment_ids)
        self.client.get(
            f"/api/v1/appointments/{appt_id}",
            headers=self.auth_headers(),
            name="/api/v1/appointments/{id}"
        )

    @task(1)
    def get_my_profile(self):
        if not self.token:
            return
        self.client.get(
            "/api/v1/auth/me",
            headers=self.auth_headers(),
            name="/api/v1/auth/me"
        )

    @task(1)
    def cancel_appointment(self):
        if not self.token or not self.appointment_ids:
            return
        appt_id = self.appointment_ids.pop()
        self.client.patch(
            f"/api/v1/appointments/{appt_id}/cancel",
            json={"reason": "Load test cancellation"},
            headers=self.auth_headers(),
            name="/api/v1/appointments/{id}/cancel"
        )

    @task(1)
    def check_queue_position(self):
        if not self.token:
            return
        self.client.get(
            "/api/v1/queue/my-position",
            headers=self.auth_headers(),
            name="/api/v1/queue/my-position"
        )


# Scenario 3: Staff User
# Simulates a staff member managing
# the queue in the admin dashboard.
# Weight: 20% of total users


class StaffUser(HttpUser):
    """
    Represents a staff member who:
    - Logs in as a staff user
    - Monitors queue status for their location
    - Lists all appointments
    - Views appointment details
    """
    weight = 2
    wait_time = between(3, 8)

    # Pre-created staff credentials - create this user manually before running
    STAFF_EMAIL = "staff_loadtest@lonestardental.com"
    STAFF_PASSWORD = "StaffLoad123!"

    def on_start(self):
        self.token = None
        self.location_ids = []

        res = self.client.post(
            "/api/v1/auth/login",
            json={"email": self.STAFF_EMAIL, "password": self.STAFF_PASSWORD},
            name="/api/v1/auth/login [staff]"
        )

        if res.status_code == 200:
            self.token = res.json().get("access_token")

        loc_res = self.client.get("/api/v1/locations/", name="/api/v1/locations/ [staff init]")
        if loc_res.status_code == 200:
            self.location_ids = [loc["id"] for loc in loc_res.json()]

    def auth_headers(self):
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    @task(5)
    def poll_queue_status(self):
        """Staff frequently polls queue status - simulates the live admin queue board."""
        if not self.location_ids:
            return
        location_id = random.choice(self.location_ids)
        self.client.get(
            f"/api/v1/queue/status/{location_id}",
            name="/api/v1/queue/status/{location_id}"
        )

    @task(3)
    def list_appointments(self):
        if not self.token:
            return
        self.client.get(
            "/api/v1/appointments/",
            headers=self.auth_headers(),
            name="/api/v1/appointments/ [staff list]"
        )

    @task(2)
    def list_locations(self):
        self.client.get(
            "/api/v1/locations/",
            name="/api/v1/locations/ [staff]"
        )

    @task(1)
    def refresh_token(self):
        if not self.token:
            return
        res = self.client.post(
            "/api/v1/auth/login",
            json={"email": self.STAFF_EMAIL, "password": self.STAFF_PASSWORD},
            name="/api/v1/auth/login [staff refresh]"
        )
        if res.status_code == 200:
            self.token = res.json().get("access_token")


# Event Hooks


@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("\n" + "=" * 60)
    print("  Lone Star Dental - Load Test Starting")
    print("  Target: https://smartappointmentapi.digitalocean.hasala.me")
    print("  Scenarios: BrowseUser (40%), CustomerUser (40%), StaffUser (20%)")
    print("=" * 60 + "\n")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    print("\n" + "=" * 60)
    print("  Load Test Complete")
    print(f"  Total Requests : {environment.stats.total.num_requests}")
    print(f"  Failures       : {environment.stats.total.num_failures}")
    print(f"  Avg Response   : {environment.stats.total.avg_response_time:.1f}ms")
    print(f"  RPS            : {environment.stats.total.current_rps:.1f}")
    print("=" * 60 + "\n")