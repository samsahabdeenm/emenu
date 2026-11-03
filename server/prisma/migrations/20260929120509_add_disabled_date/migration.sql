-- AlterTable
ALTER TABLE "products" ADD COLUMN     "availableDays" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "disabledDate" TEXT;
