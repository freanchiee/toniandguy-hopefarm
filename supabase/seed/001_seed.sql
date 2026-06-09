insert into stylists (name, speciality, photo_url, bio)
values
  ('Pavitra', 'Senior Beautician', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80', 'Facials, threading, manicure, pedicure, and grooming services.'),
  ('Simick', 'Unisex Hairdresser', 'https://images.unsplash.com/photo-1595475884562-073c30d45670?auto=format&fit=crop&w=900&q=80', 'Colour transformations, highlights, and personalized hair makeovers.'),
  ('Sumit', 'Unisex Top Stylist', 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=900&q=80', 'Precision cuts, wearable shape, and polished finish.'),
  ('Arnik', 'Unisex Hairstylist', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80', 'Treatments, smoothening work, and detailed styling.')
on conflict do nothing;

insert into services (name, description, price_from, price_to, duration_minutes, category)
values
  ('Haircut', 'Men''s cuts, women''s cuts, and consultation-led shape work.', 700, 2500, 45, 'Cut'),
  ('Colour', 'Global colour, root work, and tonal refreshes for polished dimension.', 2500, 7500, 90, 'Colour'),
  ('Highlights', 'Soft face framing, balayage, and dimensional light work.', 3500, 12000, 150, 'Colour'),
  ('Blowout', 'Clean finish, volume, and event-ready shape with lasting hold.', 900, 1800, 35, 'Styling'),
  ('Hair Spa', 'System Professional spa rituals, scalp care, and shine recovery.', 1800, 6000, 60, 'Treatment'),
  ('Treatment', 'Keratin, Nanoplastia, Botox, and advanced repair treatments.', 1800, 9000, 60, 'Treatment'),
  ('Facials', 'Facials, de-tan, body polish, and grooming treatments.', 1000, 8000, 60, 'Beauty'),
  ('Manicure and Pedicure', 'Hand and foot grooming services.', 700, 3000, 45, 'Nails')
on conflict do nothing;

insert into gallery (image_url, caption)
values
  ('https://picsum.photos/seed/toni-guy-01/900/1200', 'Dimensional colour finish'),
  ('https://picsum.photos/seed/toni-guy-02/900/700', 'Salon texture study'),
  ('https://picsum.photos/seed/toni-guy-03/900/1100', 'Precision cut detail'),
  ('https://picsum.photos/seed/toni-guy-04/900/800', 'Bridal styling trial'),
  ('https://picsum.photos/seed/toni-guy-05/900/1250', 'Treatment finish')
on conflict do nothing;
