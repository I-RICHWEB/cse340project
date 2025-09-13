--Inserting a new record into the account table.
INSERT INTO public.account (
	account_firstname,
	account_lastname,
	account_email,
	account_password
)
VALUES (
'Tony', 
'Stark', 
'tony@starkent.com', 
'Iam1ronM@n'
);

--Modifying the account type to Admin.
UPDATE public.account
SET account_type = 'Admin'  
WHERE account_id = 1;

--Deleting Tony's record from the account table.
DELETE FROM public.account
WHERE account_id = 1;

--Modifying the GM Hummer record in the inventory table.
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'huge interior')
WHERE inv_description LIKE '%small interiors%';

--Selecting from multiple tables using an inner join.
SELECT public.inventory.inv_make, public.inventory.inv_model, public.classification.classification_name
FROM public.inventory
INNER JOIN public.classification 
ON public.inventory.classification_id = public.classification.classification_id
WHERE public.classification.classification_name = 'Sport';

--Updating all records in the inventory table to include '/vehicles' in the image and thumbnail path.
UPDATE inventory
SET 
	inv_image = REPLACE(inv_image, '/images','/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images','/images/vehicles')
	
WHERE inv_image LIKE '%/images%' OR inv_thumbnail LIKE '%/images%';