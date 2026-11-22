-- Deleting an account now deletes its orders too (order items follow via their own cascade).
ALTER TABLE "Order" DROP CONSTRAINT "Order_userId_fkey";
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
