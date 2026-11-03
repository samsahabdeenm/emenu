ALTER TABLE "menus"
ADD COLUMN "todaysSpecialEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "todaysSpecialTitle" TEXT NOT NULL DEFAULT 'Today''s Special',
ADD COLUMN "todaysSpecialProductIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

ALTER TABLE "products"
ADD COLUMN "highlightLabel" TEXT;
