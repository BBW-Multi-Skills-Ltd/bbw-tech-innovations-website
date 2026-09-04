-- A 10-minute browser recording needs more than the initial short-form video allowance.
update storage.buckets
set file_size_limit = 104857600
where id = 'enquiry-videos';
