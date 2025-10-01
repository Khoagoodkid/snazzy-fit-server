/*
  Warnings:

  - You are about to drop the column `facebook_access_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `facebook_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `facebook_id` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `facebook_access_token`,
    DROP COLUMN `facebook_id`;
