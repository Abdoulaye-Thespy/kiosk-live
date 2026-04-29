-- CreateEnum
CREATE TYPE "ProformaStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'CONVERTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('NEW_KIOSK', 'NEW_COMPARTMENT', 'UPGRADE', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "KioskBrandingType" AS ENUM ('MONO', 'GRAND', 'COMPARTIMENT');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('PARTICULIER', 'ENTREPRISE', 'STAFF');

-- CreateEnum
CREATE TYPE "ContractStatus" AS ENUM ('DRAFT', 'PENDING', 'CONFIRMED', 'ACTIVE', 'EXPIRED', 'TERMINATED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "KioskTown" AS ENUM ('DOUALA', 'YAOUNDE');

-- CreateEnum
CREATE TYPE "KioskType" AS ENUM ('MONO', 'GRAND');

-- CreateEnum
CREATE TYPE "CompartmentType" AS ENUM ('LEFT', 'MIDDLE', 'RIGHT', 'SINGLE');

-- CreateEnum
CREATE TYPE "CompartmentStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "KioskStatus" AS ENUM ('REQUEST', 'LOCALIZING', 'AVAILABLE', 'UNDER_MAINTENANCE', 'IN_STOCK', 'ACTIVE', 'UNACTIVE', 'ACTIVE_UNDER_MAINTENANCE', 'UNACTIVE_UNDER_MAINTENANCE');

-- CreateEnum
CREATE TYPE "KioskRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ServiceRequestStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'UNDER_REVIEW', 'CLOSED');

-- CreateEnum
CREATE TYPE "RequestPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PAID', 'PENDING', 'OVERDUE');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'VERIFIED', 'ONLINE', 'OFFLINE', 'DELETED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('SENT', 'VIEWED');

-- CreateEnum
CREATE TYPE "ProspectStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'CONVERTED', 'LOST');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'RESPONSABLE', 'TECHNICIEN', 'SUPERADMIN', 'COMMERCIAL', 'ADMIN', 'JURIDIQUE', 'CLIENTADMIN', 'RESPONSABLEKIOSK', 'COMPTABLE');

-- CreateEnum
CREATE TYPE "DeletedEntityType" AS ENUM ('USER', 'CONTRACT', 'PROFORMA', 'PROSPECT', 'KIOSK', 'KIOSK_COMPARTMENT');

-- CreateEnum
CREATE TYPE "DeleteActionType" AS ENUM ('SOFT_DELETE', 'PERMANENT_DELETE', 'RESTORE', 'ARCHIVE');

-- CreateTable
CREATE TABLE "deleted_records" (
    "id" TEXT NOT NULL,
    "originalId" TEXT NOT NULL,
    "entityType" "DeletedEntityType" NOT NULL,
    "entityData" JSONB NOT NULL,
    "deletedBy" TEXT NOT NULL,
    "deletedByEmail" TEXT NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleteAction" "DeleteActionType" NOT NULL DEFAULT 'SOFT_DELETE',
    "restorationDate" TIMESTAMP(3),
    "restoredBy" TEXT,
    "permanentDeleteDate" TIMESTAMP(3),
    "reason" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "deleted_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "oldValues" JSONB,
    "newValues" JSONB,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userRole" "Role" NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "details" TEXT,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "clientType" "ClientType" NOT NULL DEFAULT 'STAFF',
    "status" "UserStatus" NOT NULL DEFAULT 'PENDING',
    "address" TEXT,
    "phone" TEXT,
    "verificationToken" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "password" TEXT,
    "resetPasswordToken" TEXT,
    "resetPasswordExpires" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_requests" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "requestType" "RequestType" NOT NULL DEFAULT 'NEW_KIOSK',
    "status" "KioskRequestStatus" NOT NULL DEFAULT 'PENDING',
    "clientId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "clientPhone" TEXT,
    "requestedKioskType" "KioskType",
    "requestedCompartments" JSONB,
    "wantBranding" BOOLEAN NOT NULL DEFAULT false,
    "kioskAddress" TEXT,
    "productTypes" TEXT,
    "managerName" TEXT,
    "managerContacts" TEXT,
    "estimatedPrice" DOUBLE PRECISION,
    "notes" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "processedBy" TEXT,
    "assignedKioskId" INTEGER,

    CONSTRAINT "kiosk_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosks" (
    "id" SERIAL NOT NULL,
    "kioskName" TEXT NOT NULL,
    "kioskMatricule" TEXT NOT NULL DEFAULT 'K-000-0000-000',
    "kioskType" "KioskType" NOT NULL,
    "kioskAddress" TEXT,
    "gpsLatitude" DOUBLE PRECISION,
    "gpsLongitude" DOUBLE PRECISION,
    "kioskTown" "KioskTown" NOT NULL DEFAULT 'DOUALA',
    "productTypes" TEXT,
    "managerName" TEXT,
    "managerContacts" TEXT,
    "locationId" TEXT,
    "status" "KioskStatus" NOT NULL DEFAULT 'REQUEST',
    "image" TEXT,
    "averageMonthlyRevenue" DECIMAL(65,30),
    "notes" TEXT,
    "monoClientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kiosks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_compartments" (
    "id" SERIAL NOT NULL,
    "kioskId" INTEGER NOT NULL,
    "compartmentType" "CompartmentType" NOT NULL DEFAULT 'SINGLE',
    "status" "CompartmentStatus" NOT NULL DEFAULT 'AVAILABLE',
    "clientId" TEXT,
    "customName" TEXT,
    "monthlyRevenue" DECIMAL(65,30),
    "notes" TEXT,
    "assignedAt" TIMESTAMP(3),
    "assignedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kiosk_compartments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_assignments" (
    "id" TEXT NOT NULL,
    "kioskId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "kiosk_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_compartment_assignments" (
    "id" TEXT NOT NULL,
    "compartmentId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "kiosk_compartment_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contracts" (
    "id" TEXT NOT NULL,
    "contractNumber" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "ContractStatus" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "signatureDate" TIMESTAMP(3),
    "terminationDate" TIMESTAMP(3),
    "clientName" TEXT NOT NULL,
    "clientIdNumber" TEXT,
    "clientIdIssuedDate" TIMESTAMP(3),
    "clientIdIssuedPlace" TEXT,
    "clientAddress" TEXT,
    "clientPhone" TEXT,
    "clientBusinessAddress" TEXT,
    "clientBusinessQuarter" TEXT,
    "clientBusinessLocation" TEXT,
    "contractDuration" INTEGER NOT NULL,
    "paymentFrequency" TEXT NOT NULL,
    "paymentAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "createdById" TEXT NOT NULL,
    "signedById" TEXT,
    "contractDocument" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_contracts" (
    "id" TEXT NOT NULL,
    "contractId" TEXT NOT NULL,
    "kioskId" INTEGER NOT NULL,
    "compartmentId" INTEGER,
    "monthlyRent" DOUBLE PRECISION NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kiosk_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contract_actions" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "contractId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contract_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proformas" (
    "id" TEXT NOT NULL,
    "proformaNumber" TEXT NOT NULL,
    "status" "ProformaStatus" NOT NULL DEFAULT 'DRAFT',
    "clientId" TEXT,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT,
    "clientPhone" TEXT,
    "clientAddress" TEXT,
    "kioskSelections" JSONB NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "dtsp" DOUBLE PRECISION NOT NULL,
    "tva" DOUBLE PRECISION NOT NULL,
    "dtspRate" DOUBLE PRECISION NOT NULL DEFAULT 3.0,
    "tvaRate" DOUBLE PRECISION NOT NULL DEFAULT 19.25,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "kioskType" "KioskBrandingType",
    "quantity" INTEGER,
    "surfaces" JSONB,
    "basePrice" DOUBLE PRECISION,
    "brandingPrice" DOUBLE PRECISION,
    "createdById" TEXT NOT NULL,
    "contractId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "sentDate" TIMESTAMP(3),
    "acceptedDate" TIMESTAMP(3),
    "rejectedDate" TIMESTAMP(3),
    "convertedDate" TIMESTAMP(3),
    "pdfUrl" TEXT,

    CONSTRAINT "proformas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prospects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact" TEXT,
    "address" TEXT,
    "need" TEXT,
    "prospectStatus" "ProspectStatus" NOT NULL DEFAULT 'NEW',
    "source" TEXT,
    "estimatedValue" DECIMAL(65,30),
    "notes" TEXT,
    "lastContactDate" TIMESTAMP(3),
    "conversionDate" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "deletedBy" TEXT,
    "convertedUserId" TEXT,
    "assignedToId" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prospects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prospect_actions" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "userId" TEXT,
    "actionType" TEXT NOT NULL,
    "actionDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prospect_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "unitPrice" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kiosk_inventories" (
    "id" TEXT NOT NULL,
    "kioskId" INTEGER NOT NULL,
    "compartmentId" INTEGER,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "lastRestocked" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kiosk_inventories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_movements" (
    "id" TEXT NOT NULL,
    "kioskId" INTEGER NOT NULL,
    "compartmentId" INTEGER,
    "productId" TEXT NOT NULL,
    "movementType" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT,
    "createdById" TEXT,
    "movementDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_requests" (
    "id" TEXT NOT NULL,
    "kioskId" INTEGER NOT NULL,
    "compartmentId" INTEGER,
    "problemDescription" TEXT NOT NULL,
    "comments" TEXT,
    "status" "ServiceRequestStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "RequestPriority" NOT NULL DEFAULT 'MEDIUM',
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deadLine" TIMESTAMP(3),
    "resolvedDate" TIMESTAMP(3),
    "attachments" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "location_histories" (
    "id" TEXT NOT NULL,
    "kioskId" INTEGER NOT NULL,
    "oldLocation" TEXT,
    "newLocation" TEXT,
    "validatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "location_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "clientOrVendor" TEXT,
    "type" TEXT,
    "issueDate" TIMESTAMP(3),
    "termsConditions" TEXT,
    "contractId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "paymentMethod" TEXT,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" TEXT NOT NULL,
    "prospectId" TEXT NOT NULL,
    "createdById" TEXT,
    "services" TEXT,
    "totalCost" DECIMAL(65,30),
    "deadlineDate" TIMESTAMP(3),
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'SENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "generatedById" TEXT,
    "validationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TechnicianServiceRequests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TechnicianServiceRequests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "deleted_records_originalId_idx" ON "deleted_records"("originalId");

-- CreateIndex
CREATE INDEX "deleted_records_entityType_idx" ON "deleted_records"("entityType");

-- CreateIndex
CREATE INDEX "deleted_records_deletedBy_idx" ON "deleted_records"("deletedBy");

-- CreateIndex
CREATE INDEX "deleted_records_deletedAt_idx" ON "deleted_records"("deletedAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_resetPasswordToken_key" ON "users"("resetPasswordToken");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "kiosk_requests_requestNumber_key" ON "kiosk_requests"("requestNumber");

-- CreateIndex
CREATE INDEX "kiosk_requests_clientId_idx" ON "kiosk_requests"("clientId");

-- CreateIndex
CREATE INDEX "kiosk_requests_status_idx" ON "kiosk_requests"("status");

-- CreateIndex
CREATE INDEX "kiosk_requests_requestNumber_idx" ON "kiosk_requests"("requestNumber");

-- CreateIndex
CREATE INDEX "kiosk_requests_createdAt_idx" ON "kiosk_requests"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "kiosks_kioskMatricule_key" ON "kiosks"("kioskMatricule");

-- CreateIndex
CREATE INDEX "kiosks_kioskMatricule_idx" ON "kiosks"("kioskMatricule");

-- CreateIndex
CREATE INDEX "kiosks_status_idx" ON "kiosks"("status");

-- CreateIndex
CREATE INDEX "kiosks_kioskType_idx" ON "kiosks"("kioskType");

-- CreateIndex
CREATE INDEX "kiosk_compartments_kioskId_idx" ON "kiosk_compartments"("kioskId");

-- CreateIndex
CREATE INDEX "kiosk_compartments_clientId_idx" ON "kiosk_compartments"("clientId");

-- CreateIndex
CREATE INDEX "kiosk_compartments_status_idx" ON "kiosk_compartments"("status");

-- CreateIndex
CREATE UNIQUE INDEX "kiosk_compartments_kioskId_compartmentType_key" ON "kiosk_compartments"("kioskId", "compartmentType");

-- CreateIndex
CREATE UNIQUE INDEX "kiosk_assignments_kioskId_userId_role_key" ON "kiosk_assignments"("kioskId", "userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "kiosk_compartment_assignments_compartmentId_userId_role_key" ON "kiosk_compartment_assignments"("compartmentId", "userId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "contracts_contractNumber_key" ON "contracts"("contractNumber");

-- CreateIndex
CREATE INDEX "contracts_contractNumber_idx" ON "contracts"("contractNumber");

-- CreateIndex
CREATE INDEX "contracts_status_idx" ON "contracts"("status");

-- CreateIndex
CREATE INDEX "contracts_deletedAt_idx" ON "contracts"("deletedAt");

-- CreateIndex
CREATE INDEX "kiosk_contracts_contractId_idx" ON "kiosk_contracts"("contractId");

-- CreateIndex
CREATE INDEX "kiosk_contracts_kioskId_idx" ON "kiosk_contracts"("kioskId");

-- CreateIndex
CREATE INDEX "kiosk_contracts_compartmentId_idx" ON "kiosk_contracts"("compartmentId");

-- CreateIndex
CREATE INDEX "kiosk_contracts_isActive_idx" ON "kiosk_contracts"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "kiosk_contracts_contractId_kioskId_compartmentId_key" ON "kiosk_contracts"("contractId", "kioskId", "compartmentId");

-- CreateIndex
CREATE INDEX "contract_actions_contractId_idx" ON "contract_actions"("contractId");

-- CreateIndex
CREATE UNIQUE INDEX "proformas_proformaNumber_key" ON "proformas"("proformaNumber");

-- CreateIndex
CREATE UNIQUE INDEX "proformas_contractId_key" ON "proformas"("contractId");

-- CreateIndex
CREATE INDEX "proformas_proformaNumber_idx" ON "proformas"("proformaNumber");

-- CreateIndex
CREATE INDEX "proformas_status_idx" ON "proformas"("status");

-- CreateIndex
CREATE INDEX "proformas_clientId_idx" ON "proformas"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "prospects_convertedUserId_key" ON "prospects"("convertedUserId");

-- CreateIndex
CREATE INDEX "prospects_prospectStatus_idx" ON "prospects"("prospectStatus");

-- CreateIndex
CREATE INDEX "prospects_deletedAt_idx" ON "prospects"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "kiosk_inventories_kioskId_idx" ON "kiosk_inventories"("kioskId");

-- CreateIndex
CREATE INDEX "kiosk_inventories_compartmentId_idx" ON "kiosk_inventories"("compartmentId");

-- CreateIndex
CREATE INDEX "inventory_movements_kioskId_idx" ON "inventory_movements"("kioskId");

-- CreateIndex
CREATE INDEX "inventory_movements_compartmentId_idx" ON "inventory_movements"("compartmentId");

-- CreateIndex
CREATE INDEX "service_requests_status_idx" ON "service_requests"("status");

-- CreateIndex
CREATE INDEX "service_requests_kioskId_idx" ON "service_requests"("kioskId");

-- CreateIndex
CREATE INDEX "service_requests_compartmentId_idx" ON "service_requests"("compartmentId");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_status_idx" ON "notifications"("status");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "_TechnicianServiceRequests_B_index" ON "_TechnicianServiceRequests"("B");

-- AddForeignKey
ALTER TABLE "kiosk_requests" ADD CONSTRAINT "kiosk_requests_assignedKioskId_fkey" FOREIGN KEY ("assignedKioskId") REFERENCES "kiosks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_requests" ADD CONSTRAINT "kiosk_requests_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosks" ADD CONSTRAINT "kiosks_monoClientId_fkey" FOREIGN KEY ("monoClientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_compartments" ADD CONSTRAINT "kiosk_compartments_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_compartments" ADD CONSTRAINT "kiosk_compartments_kioskId_fkey" FOREIGN KEY ("kioskId") REFERENCES "kiosks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_assignments" ADD CONSTRAINT "kiosk_assignments_kioskId_fkey" FOREIGN KEY ("kioskId") REFERENCES "kiosks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_assignments" ADD CONSTRAINT "kiosk_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_compartment_assignments" ADD CONSTRAINT "kiosk_compartment_assignments_compartmentId_fkey" FOREIGN KEY ("compartmentId") REFERENCES "kiosk_compartments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_compartment_assignments" ADD CONSTRAINT "kiosk_compartment_assignments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_signedById_fkey" FOREIGN KEY ("signedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_contracts" ADD CONSTRAINT "kiosk_contracts_compartmentId_fkey" FOREIGN KEY ("compartmentId") REFERENCES "kiosk_compartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_contracts" ADD CONSTRAINT "kiosk_contracts_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_contracts" ADD CONSTRAINT "kiosk_contracts_kioskId_fkey" FOREIGN KEY ("kioskId") REFERENCES "kiosks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contract_actions" ADD CONSTRAINT "contract_actions_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proformas" ADD CONSTRAINT "proformas_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proformas" ADD CONSTRAINT "proformas_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_convertedUserId_fkey" FOREIGN KEY ("convertedUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospects" ADD CONSTRAINT "prospects_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospect_actions" ADD CONSTRAINT "prospect_actions_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "prospects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prospect_actions" ADD CONSTRAINT "prospect_actions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "product_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_inventories" ADD CONSTRAINT "kiosk_inventories_compartmentId_fkey" FOREIGN KEY ("compartmentId") REFERENCES "kiosk_compartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_inventories" ADD CONSTRAINT "kiosk_inventories_kioskId_fkey" FOREIGN KEY ("kioskId") REFERENCES "kiosks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kiosk_inventories" ADD CONSTRAINT "kiosk_inventories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_compartmentId_fkey" FOREIGN KEY ("compartmentId") REFERENCES "kiosk_compartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_kioskId_fkey" FOREIGN KEY ("kioskId") REFERENCES "kiosks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movements" ADD CONSTRAINT "inventory_movements_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_compartmentId_fkey" FOREIGN KEY ("compartmentId") REFERENCES "kiosk_compartments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_requests" ADD CONSTRAINT "service_requests_kioskId_fkey" FOREIGN KEY ("kioskId") REFERENCES "kiosks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_histories" ADD CONSTRAINT "location_histories_kioskId_fkey" FOREIGN KEY ("kioskId") REFERENCES "kiosks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "location_histories" ADD CONSTRAINT "location_histories_validatedById_fkey" FOREIGN KEY ("validatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "prospects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TechnicianServiceRequests" ADD CONSTRAINT "_TechnicianServiceRequests_A_fkey" FOREIGN KEY ("A") REFERENCES "service_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TechnicianServiceRequests" ADD CONSTRAINT "_TechnicianServiceRequests_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
