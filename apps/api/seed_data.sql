--
-- PostgreSQL database dump
--

\restrict JykJycOYheeGAnjYMyqUoYgvySdXVeSvo6JwGTaWsILSQ3sXaUqz6JerFYbjjJs

-- Dumped from database version 17.8 (130b160)
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.locations (id, name, slug, address, city, state, zip_code, phone, timezone, appointment_duration_mins, buffer_mins, is_active, settings, created_at, updated_at) VALUES ('83e0e502-d82c-450a-a2a0-09094d97828f', 'Houston - Downtown', 'houston-downtown', '123 Main St', 'Houston', 'TX', '77002', '(713) 555-0101', 'America/Chicago', 30, 10, true, NULL, '2026-02-28 05:22:04.857493', '2026-02-28 05:22:04.857493');
INSERT INTO public.locations (id, name, slug, address, city, state, zip_code, phone, timezone, appointment_duration_mins, buffer_mins, is_active, settings, created_at, updated_at) VALUES ('2b54653a-04df-4955-ab13-be2cd6ac2d74', 'Houston - Galleria', 'houston-galleria', '456 Westheimer Rd', 'Houston', 'TX', '77056', '(713) 555-0102', 'America/Chicago', 30, 10, true, NULL, '2026-02-28 05:22:45.248188', '2026-02-28 05:22:45.248188');
INSERT INTO public.locations (id, name, slug, address, city, state, zip_code, phone, timezone, appointment_duration_mins, buffer_mins, is_active, settings, created_at, updated_at) VALUES ('cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48', 'Austin - Central', 'austin-central', '789 Congress Ave', 'Austin', 'TX', '78701', '(512) 555-0103', 'America/Chicago', 30, 10, true, NULL, '2026-02-28 05:22:50.507326', '2026-02-28 05:22:50.507326');
INSERT INTO public.locations (id, name, slug, address, city, state, zip_code, phone, timezone, appointment_duration_mins, buffer_mins, is_active, settings, created_at, updated_at) VALUES ('f560fb2d-bec6-4e53-9289-c43da44f5d8d', 'Austin - Round Rock', 'austin-round-rock', '321 Palm Valley Blvd', 'Round Rock', 'TX', '78664', '(512) 555-0104', 'America/Chicago', 30, 10, true, NULL, '2026-02-28 05:22:54.762109', '2026-02-28 05:22:54.762109');
INSERT INTO public.locations (id, name, slug, address, city, state, zip_code, phone, timezone, appointment_duration_mins, buffer_mins, is_active, settings, created_at, updated_at) VALUES ('0038db68-eb7b-488f-a390-fb6b9cbb2225', 'Dallas - Uptown', 'dallas-uptown', '555 McKinney Ave', 'Dallas', 'TX', '75201', '(214) 555-0105', 'America/Chicago', 30, 10, true, NULL, '2026-02-28 05:22:59.134872', '2026-02-28 05:22:59.134872');
INSERT INTO public.locations (id, name, slug, address, city, state, zip_code, phone, timezone, appointment_duration_mins, buffer_mins, is_active, settings, created_at, updated_at) VALUES ('90105d5e-feb7-4eda-bda1-1cea1eb3ed63', 'Fort Worth - Sundance', 'fort-worth-sundance', '888 Sundance Square', 'Fort Worth', 'TX', '76102', '(817) 555-0106', 'America/Chicago', 30, 10, true, NULL, '2026-02-28 05:23:02.939935', '2026-02-28 05:23:02.939935');


--
-- Data for Name: availability; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('3e482814-4439-47ab-849b-819dd22f4876', '0038db68-eb7b-488f-a390-fb6b9cbb2225', 1, '09:00:00', '17:00:00', true, '2026-03-02 10:05:57.193763');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('58cf33c5-7b70-424b-871c-45cffb69c999', '0038db68-eb7b-488f-a390-fb6b9cbb2225', 2, '09:00:00', '17:00:00', true, '2026-03-02 10:05:57.312287');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('77dc978e-b45f-4c07-a8ab-5efa6082a289', '0038db68-eb7b-488f-a390-fb6b9cbb2225', 4, '09:00:00', '17:00:00', true, '2026-03-02 10:05:57.463414');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('d71539fc-7072-4b61-87db-07d3d6ad4e69', '0038db68-eb7b-488f-a390-fb6b9cbb2225', 5, '09:00:00', '17:00:00', true, '2026-03-02 10:05:57.542051');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('5b64c171-b8ff-4190-959b-795667d1cf2c', '0038db68-eb7b-488f-a390-fb6b9cbb2225', 3, '09:00:00', '17:00:00', true, '2026-03-02 10:05:57.389076');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('02fa1dab-e51e-453a-8bf3-4286dc5cc86b', '2b54653a-04df-4955-ab13-be2cd6ac2d74', 1, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('281371dd-bcc1-4429-9d11-08743c44277f', '2b54653a-04df-4955-ab13-be2cd6ac2d74', 2, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('5c9ac97b-2fc8-41b9-b6c3-37712c7424ec', '2b54653a-04df-4955-ab13-be2cd6ac2d74', 3, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('98caabec-ed1d-4734-8dc7-784c6edd1fc6', '2b54653a-04df-4955-ab13-be2cd6ac2d74', 4, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('5f996874-c162-41b5-a83d-59fefeebc16d', '2b54653a-04df-4955-ab13-be2cd6ac2d74', 5, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('5bb33536-811a-4122-ac20-520508ae5ff4', '83e0e502-d82c-450a-a2a0-09094d97828f', 1, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('f858159e-a822-420c-b7de-d743adfd01bf', '83e0e502-d82c-450a-a2a0-09094d97828f', 2, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('4ba65942-1d51-407d-83f2-eb21bc8476fe', '83e0e502-d82c-450a-a2a0-09094d97828f', 3, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('03d6294c-6ce3-44a6-b24e-7710ad92d69b', '83e0e502-d82c-450a-a2a0-09094d97828f', 4, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('4fa3f147-5b1c-4c6e-af97-e5aadfd99095', '83e0e502-d82c-450a-a2a0-09094d97828f', 5, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('468c90ac-b04b-4594-901b-069efdfbd790', '90105d5e-feb7-4eda-bda1-1cea1eb3ed63', 1, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('d06c4004-b90e-4406-bf0a-b9ec421780cd', '90105d5e-feb7-4eda-bda1-1cea1eb3ed63', 2, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('e3cb2004-5ba1-4109-a929-5e58b5e5190c', '90105d5e-feb7-4eda-bda1-1cea1eb3ed63', 3, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('36888133-fae8-453c-99e4-00905742c873', '90105d5e-feb7-4eda-bda1-1cea1eb3ed63', 4, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('c99ab0a2-388a-4623-9789-7b08633d36ac', '90105d5e-feb7-4eda-bda1-1cea1eb3ed63', 5, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('30289329-e0a9-4f78-a3d1-ff846f7197ee', 'cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48', 1, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('16c37fcf-a218-4ef2-8a51-75f57041630e', 'cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48', 2, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('d26e0c5d-1fb9-4391-aa9e-49592871c082', 'cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48', 3, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('1dc3f630-d54e-4334-bda4-13ca4bd8d6c0', 'cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48', 4, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('20b5f49e-1fa1-4e0e-8e2e-0ae58158713a', 'cfa2dc76-3c0f-4eae-a557-4bb8c77b6b48', 5, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('33f35e3e-7be9-4116-b59a-066cb7bcf032', 'f560fb2d-bec6-4e53-9289-c43da44f5d8d', 1, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('7b21a2e2-9359-4986-ba1d-acc9f8b2eb44', 'f560fb2d-bec6-4e53-9289-c43da44f5d8d', 2, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('c5b22210-1757-441e-90b8-7f682fb0e75b', 'f560fb2d-bec6-4e53-9289-c43da44f5d8d', 3, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('e0588072-b5e4-4e49-8ac9-fedb9c4cf2b9', 'f560fb2d-bec6-4e53-9289-c43da44f5d8d', 4, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');
INSERT INTO public.availability (id, location_id, day_of_week, start_time, end_time, is_available, created_at) VALUES ('b6c3b679-75fa-4854-899b-5053d0042b7a', 'f560fb2d-bec6-4e53-9289-c43da44f5d8d', 5, '09:00:00', '17:00:00', true, '2026-03-03 05:39:48.295564');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified, last_login_at, created_at, updated_at, date_of_birth, dental_insurance_status, has_dental_insurance) VALUES ('76fd6b1f-d215-4189-b8c2-9e6fd8c31be1', 'hhasala2002@gmail.com', '$2b$12$2jWd/2ZeVGt/0rrw/QBTSOnnc8Dlk.AL9z6P1NiiH61FPDQnWgTvC', 'Hasala', 'Heiyanthuduwa', '8322765131', 'customer', true, false, NULL, '2026-03-03 05:21:48.560405', '2026-03-03 05:21:48.560405', '2002-06-13', NULL, NULL);
INSERT INTO public.users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified, last_login_at, created_at, updated_at, date_of_birth, dental_insurance_status, has_dental_insurance) VALUES ('3fa85f64-5717-4562-b3fc-2c963f66afa6', 'admin@lonestardental.com', '$2a$06$5l.FNMpwoRWWFLfLbmsLIeHd1/G/Yy12r0jYw94e8IdPny.AZNqyC', 'Lone Star', 'Admin', '000', 'staff', true, true, NULL, '2026-03-03 05:26:59.907164', '2026-03-03 05:27:00.062682', '2000-01-01', NULL, false);
INSERT INTO public.users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified, last_login_at, created_at, updated_at, date_of_birth, dental_insurance_status, has_dental_insurance) VALUES ('991044a2-0607-48d7-9fc2-a22f74be6f69', 'galhouston.admin@lonestardental.com', '$2a$06$hTX8oezy/VB.Xj2.x9TDpuU4feccUQBAR20tFt3kdkyynR5VfIhZy', 'Galleria Houston', 'Admin', '000', 'staff', true, true, NULL, '2026-03-03 05:57:33.68399', '2026-03-03 05:58:00.231104', '2000-01-01', NULL, false);
INSERT INTO public.users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified, last_login_at, created_at, updated_at, date_of_birth, dental_insurance_status, has_dental_insurance) VALUES ('92045a2d-79c7-4381-b442-c40ad9ef07c5', 'hvishwa2004@gmail.com', '$2b$12$w/LmiL1cXXSFO7DlvqBYAeRdTpI2BZQY56yrgBJ0LelMf0ri.E.9S', 'Vishwa', 'Heiyanthuduwa', '8323591504', 'customer', true, false, NULL, '2026-03-03 16:19:04.454839', '2026-03-03 16:19:04.454839', '2004-01-05', NULL, NULL);
INSERT INTO public.users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified, last_login_at, created_at, updated_at, date_of_birth, dental_insurance_status, has_dental_insurance) VALUES ('94d7d45f-6c1e-4626-a775-07ceec5c7ec9', 'john@gmail.com', '$2b$12$OepZZoaIrwX9AL/pPzL0PeZCvkEexbP.OXRe/onrZaIxa6eds3Iiq', 'John', 'Doe', '1111111111', 'customer', true, false, NULL, '2026-03-03 18:06:23.303573', '2026-03-03 18:06:23.303573', '2002-01-01', NULL, NULL);
INSERT INTO public.users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified, last_login_at, created_at, updated_at, date_of_birth, dental_insurance_status, has_dental_insurance) VALUES ('71d384ba-7eb3-4505-ae34-64a25fd1fd10', 'hasala.heiyanthuduwa@gmail.com', '$2b$12$5QF6IXCS7ZqKUUoCaOEHiOil543E4SV5GEXJwIF3B.AupebUngp82', 'Hasala2', 'Heiyanthuduwa2', '8322765131', 'customer', true, false, NULL, '2026-03-31 05:39:34.683751', '2026-03-31 05:39:34.683751', '2002-06-01', NULL, NULL);


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.staff (id, user_id, location_id, is_admin, has_global_access, created_at) VALUES ('2eeb09dc-0e02-4f0f-9c5e-628687706b95', '3fa85f64-5717-4562-b3fc-2c963f66afa6', NULL, true, true, '2026-03-03 05:26:59.970858');
INSERT INTO public.staff (id, user_id, location_id, is_admin, has_global_access, created_at) VALUES ('5dad7536-a164-48cc-9c3e-b1c836986116', '991044a2-0607-48d7-9fc2-a22f74be6f69', '2b54653a-04df-4955-ab13-be2cd6ac2d74', true, false, '2026-03-03 05:58:00.16514');


--
-- PostgreSQL database dump complete
--

\unrestrict JykJycOYheeGAnjYMyqUoYgvySdXVeSvo6JwGTaWsILSQ3sXaUqz6JerFYbjjJs

