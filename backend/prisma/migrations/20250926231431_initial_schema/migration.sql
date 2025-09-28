-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'RISK_MANAGER', 'COMPLIANCE_OFFICER', 'VIEWER', 'USER');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "RiskStatus" AS ENUM ('IDENTIFIED', 'ASSESSED', 'MITIGATED', 'MONITORED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ControlType" AS ENUM ('PREVENTIVE', 'DETECTIVE', 'CORRECTIVE', 'COMPENSATING');

-- CreateEnum
CREATE TYPE "ControlStatus" AS ENUM ('NOT_IMPLEMENTED', 'IN_PROGRESS', 'IMPLEMENTED', 'NEEDS_UPDATE', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'APPROVED', 'ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "VendorRisk" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "VendorStatus" AS ENUM ('PROSPECTIVE', 'ACTIVE', 'INACTIVE', 'TERMINATED');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('HARDWARE', 'SOFTWARE', 'DATA', 'PERSONNEL', 'FACILITY', 'CLOUD');

-- CreateEnum
CREATE TYPE "SystemCriticality" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
    "due_date" TIMESTAMP(3),
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "progress" INTEGER NOT NULL DEFAULT 0,
    "assignee_id" TEXT,
    "creator_id" TEXT NOT NULL,
    "risk_id" TEXT,
    "control_id" TEXT,
    "incident_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "risks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "level" "RiskLevel" NOT NULL,
    "status" "RiskStatus" NOT NULL DEFAULT 'IDENTIFIED',
    "likelihood" INTEGER NOT NULL,
    "impact" INTEGER NOT NULL,
    "risk_score" DOUBLE PRECISION NOT NULL,
    "residual_risk" DOUBLE PRECISION,
    "target_risk" DOUBLE PRECISION,
    "owner_id" TEXT NOT NULL,
    "creator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "controls" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "ControlType" NOT NULL,
    "status" "ControlStatus" NOT NULL DEFAULT 'NOT_IMPLEMENTED',
    "framework" TEXT,
    "reference" TEXT,
    "effectiveness" INTEGER,
    "implementation_date" TIMESTAMP(3),
    "last_test_date" TIMESTAMP(3),
    "next_test_date" TIMESTAMP(3),
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "controls_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "incidents" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" "IncidentSeverity" NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "detected_date" TIMESTAMP(3) NOT NULL,
    "resolved_date" TIMESTAMP(3),
    "root_cause" TEXT,
    "impact" TEXT,
    "resolution" TEXT,
    "lessons_learned" TEXT,
    "reporter_id" TEXT NOT NULL,
    "assignee_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'DRAFT',
    "effective_date" TIMESTAMP(3),
    "review_date" TIMESTAMP(3),
    "next_review_date" TIMESTAMP(3),
    "content" TEXT,
    "author_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" TEXT NOT NULL,
    "uploader_id" TEXT NOT NULL,
    "task_id" TEXT,
    "risk_id" TEXT,
    "control_id" TEXT,
    "incident_id" TEXT,
    "policy_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_name" TEXT,
    "contact_email" TEXT,
    "contact_phone" TEXT,
    "website" TEXT,
    "risk_level" "VendorRisk" NOT NULL DEFAULT 'LOW',
    "status" "VendorStatus" NOT NULL DEFAULT 'PROSPECTIVE',
    "last_assessment" TIMESTAMP(3),
    "next_assessment" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vendors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "systems" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "criticality" "SystemCriticality" NOT NULL,
    "environment" TEXT,
    "data_types" TEXT[],
    "vendor_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "AssetType" NOT NULL,
    "serial_number" TEXT,
    "location" TEXT,
    "value" DOUBLE PRECISION,
    "system_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "department" TEXT,
    "position" TEXT,
    "manager" TEXT,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'ACTIVE',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "details" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "user_id" TEXT NOT NULL,
    "task_id" TEXT,
    "risk_id" TEXT,
    "control_id" TEXT,
    "incident_id" TEXT,
    "policy_id" TEXT,
    "vendor_id" TEXT,
    "system_id" TEXT,
    "asset_id" TEXT,
    "employee_record_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ControlToRisk" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_IncidentToRisk" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "tasks_assignee_id_idx" ON "tasks"("assignee_id");

-- CreateIndex
CREATE INDEX "tasks_creator_id_idx" ON "tasks"("creator_id");

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "risks_owner_id_idx" ON "risks"("owner_id");

-- CreateIndex
CREATE INDEX "risks_status_idx" ON "risks"("status");

-- CreateIndex
CREATE INDEX "risks_level_idx" ON "risks"("level");

-- CreateIndex
CREATE INDEX "controls_owner_id_idx" ON "controls"("owner_id");

-- CreateIndex
CREATE INDEX "controls_status_idx" ON "controls"("status");

-- CreateIndex
CREATE INDEX "incidents_reporter_id_idx" ON "incidents"("reporter_id");

-- CreateIndex
CREATE INDEX "incidents_assignee_id_idx" ON "incidents"("assignee_id");

-- CreateIndex
CREATE INDEX "incidents_status_idx" ON "incidents"("status");

-- CreateIndex
CREATE INDEX "incidents_severity_idx" ON "incidents"("severity");

-- CreateIndex
CREATE INDEX "policies_author_id_idx" ON "policies"("author_id");

-- CreateIndex
CREATE INDEX "policies_status_idx" ON "policies"("status");

-- CreateIndex
CREATE INDEX "evidence_uploader_id_idx" ON "evidence"("uploader_id");

-- CreateIndex
CREATE INDEX "systems_vendor_id_idx" ON "systems"("vendor_id");

-- CreateIndex
CREATE INDEX "assets_system_id_idx" ON "assets"("system_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employee_id_key" ON "employees"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE INDEX "activities_user_id_idx" ON "activities"("user_id");

-- CreateIndex
CREATE INDEX "activities_entity_type_entity_id_idx" ON "activities"("entity_type", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ControlToRisk_AB_unique" ON "_ControlToRisk"("A", "B");

-- CreateIndex
CREATE INDEX "_ControlToRisk_B_index" ON "_ControlToRisk"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_IncidentToRisk_AB_unique" ON "_IncidentToRisk"("A", "B");

-- CreateIndex
CREATE INDEX "_IncidentToRisk_B_index" ON "_IncidentToRisk"("B");

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_risk_id_fkey" FOREIGN KEY ("risk_id") REFERENCES "risks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "controls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "controls" ADD CONSTRAINT "controls_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidents" ADD CONSTRAINT "incidents_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_uploader_id_fkey" FOREIGN KEY ("uploader_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_risk_id_fkey" FOREIGN KEY ("risk_id") REFERENCES "risks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "controls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "systems" ADD CONSTRAINT "systems_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "systems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_risk_id_fkey" FOREIGN KEY ("risk_id") REFERENCES "risks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_control_id_fkey" FOREIGN KEY ("control_id") REFERENCES "controls"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "incidents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_system_id_fkey" FOREIGN KEY ("system_id") REFERENCES "systems"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_employee_record_id_fkey" FOREIGN KEY ("employee_record_id") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ControlToRisk" ADD CONSTRAINT "_ControlToRisk_A_fkey" FOREIGN KEY ("A") REFERENCES "controls"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ControlToRisk" ADD CONSTRAINT "_ControlToRisk_B_fkey" FOREIGN KEY ("B") REFERENCES "risks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentToRisk" ADD CONSTRAINT "_IncidentToRisk_A_fkey" FOREIGN KEY ("A") REFERENCES "incidents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_IncidentToRisk" ADD CONSTRAINT "_IncidentToRisk_B_fkey" FOREIGN KEY ("B") REFERENCES "risks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
