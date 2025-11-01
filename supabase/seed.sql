-- Sample Software House (Approved)
INSERT INTO software_houses (id, name, phone, display_phone, website, status, created_at)
VALUES 
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Tech Solutions Inc.', '1234567890', '+1 (234) 567-890', 'https://techsolutions.com', 'approved', NOW() - INTERVAL '5 days'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Innovatech Solutions', '9876543210', '+1 (987) 654-321', 'https://innovatech.com', 'approved', NOW() - INTERVAL '3 days');

-- Sample Job Posts
INSERT INTO job_posts (id, software_house_id, title, image_url, youtube_url, contact_info, status, created_at, expires_at)
VALUES
  (
    'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Frontend Developer Intern',
    'https://source.unsplash.com/400x300/?office,technology',
    'https://youtube.com/watch?v=dQw4w9WgXcQ',
    'hr@techsolutions.com',
    'active',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '3 days'
  ),
  (
    'd4e5f6a7-b8c9-0123-def0-234567890123',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Backend Engineer',
    'https://source.unsplash.com/400x300/?coding,computer',
    NULL,
    'careers@techsolutions.com',
    'active',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '4 days'
  ),
  (
    'e5f6a7b8-c9d0-1234-ef01-345678901234',
    'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'UX/UI Designer',
    'https://source.unsplash.com/400x300/?design,creative',
    'https://youtube.com/watch?v=dQw4w9WgXcQ',
    'design@innovatech.com',
    'active',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '4 days'
  );

