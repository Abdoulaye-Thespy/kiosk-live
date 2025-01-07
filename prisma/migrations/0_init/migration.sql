-- CreateTable
CREATE TABLE "connections" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "connection_time" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "ip_address" VARCHAR(45),
    "status" VARCHAR(20),

    CONSTRAINT "connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "phone" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "dateinscription" TIMESTAMP(3) NOT NULL,
    "status" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

