-- AlterTable
ALTER TABLE "User" ADD COLUMN "resetPasswordExpiry" DATETIME;
ALTER TABLE "User" ADD COLUMN "resetPasswordToken" TEXT;
