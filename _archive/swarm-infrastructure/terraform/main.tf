# Swarm Intelligence Cloud Infrastructure
# Terraform configuration for Google Cloud Platform

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Cloud SQL instance for main database
resource "google_sql_database_instance" "swarm_db" {
  name             = "swarm-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-custom-2-7680"
    
    backup_configuration {
      enabled            = true
      start_time         = "02:00"
      binary_log_enabled = true
    }

    ip_configuration {
      ipv4_enabled = true
      authorized_networks {
        name  = "local-network"
        value = "0.0.0.0/0" # Restrict in production
      }
    }

    location_preference {
      zone = var.zone
    }
  }

  deletion_protection = false
}

# Database for the main application
resource "google_sql_database" "swarm_main" {
  name     = "swarm_main"
  instance = google_sql_database_instance.swarm_db.name
}

# User for the application
resource "google_sql_user" "swarm_user" {
  name     = "swarm_user"
  instance = google_sql_database_instance.swarm_db.name
  password = var.db_password
}

# Cloud Storage bucket for file storage
resource "google_storage_bucket" "swarm_storage" {
  name          = "swarm-intelligence-storage-${var.project_id}"
  location      = var.region
  force_destroy = true

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 365
    }
  }
}

# Pub/Sub topics for messaging
resource "google_pubsub_topic" "agent_tasks" {
  name = "agent-tasks"
}

resource "google_pubsub_topic" "file_changes" {
  name = "file-changes"
}

resource "google_pubsub_topic" "system_alerts" {
  name = "system-alerts"
}

resource "google_pubsub_topic" "gmail_notifications" {
  name = "gmail-notifications"
}

# Memorystore Redis for caching
resource "google_redis_instance" "swarm_redis" {
  name               = "swarm-redis"
  tier               = "STANDARD_HA"
  memory_size_gb     = 5
  region             = var.region
  location_id        = var.zone
  authorized_network = google_compute_network.default.id
}

# Cloud Run services
resource "google_cloud_run_service" "swarm_orchestrator" {
  name     = "swarm-orchestrator"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/swarm-orchestrator:${var.image_tag}"
        resources {
          limits = {
            cpu    = "2000m"
            memory = "1Gi"
          }
        }
        env {
          name  = "DATABASE_URL"
          value = "postgresql://${google_sql_user.swarm_user.name}:${var.db_password}@${google_sql_database_instance.swarm_db.public_ip_address}:5432/${google_sql_database.swarm_main.name}"
        }
        env {
          name  = "REDIS_URL"
          value = "redis://${google_redis_instance.swarm_redis.host}:6379"
        }
        env {
          name  = "PROJECT_ID"
          value = var.project_id
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service" "cognitive_shield" {
  name     = "cognitive-shield"
  location = var.region

  template {
    metadata {
      annotations = {
        "autoscaling.knative.dev/minScale" = "1"
        "run.googleapis.com/cpu-throttling" = "false"
      }
    }
    spec {
      containers {
        image = "gcr.io/${var.project_id}/cognitive-shield:${var.image_tag}"
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
        env {
          name  = "DATABASE_URL"
          value = "postgresql://${google_sql_user.swarm_user.name}:${var.db_password}@${google_sql_database_instance.swarm_db.public_ip_address}:5432/${google_sql_database.swarm_main.name}"
        }
        env {
          name  = "REDIS_URL"
          value = "redis://${google_redis_instance.swarm_redis.host}:6379"
        }
        env {
          name  = "GEMINI_API_KEY"
          value = var.gemini_api_key
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service" "project_analyzer" {
  name     = "project-analyzer"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/project-analyzer:${var.image_tag}"
        resources {
          limits = {
            cpu    = "2000m"
            memory = "2Gi"
          }
        }
        env {
          name  = "DATABASE_URL"
          value = "postgresql://${google_sql_user.swarm_user.name}:${var.db_password}@${google_sql_database_instance.swarm_db.public_ip_address}:5432/${google_sql_database.swarm_main.name}"
        }
        env {
          name  = "REDIS_URL"
          value = "redis://${google_redis_instance.swarm_redis.host}:6379"
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# IAM bindings for Cloud Run services
resource "google_cloud_run_service_iam_member" "invoker" {
  for_each = toset([
    google_cloud_run_service.swarm_orchestrator.name,
    google_cloud_run_service.cognitive_shield.name,
    google_cloud_run_service.project_analyzer.name,
  ])

  project  = google_cloud_run_service[each.key].project
  location = google_cloud_run_service[each.key].location
  service  = google_cloud_run_service[each.key].name
  role     = "roles/run.invoker"

  member = "allUsers"
}

# Service accounts for Cloud Run services
resource "google_service_account" "swarm_service_account" {
  account_id   = "swarm-service-account"
  display_name = "Swarm Intelligence Service Account"
}

# Grant necessary permissions to service account
resource "google_project_iam_member" "swarm_service_account_storage" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.swarm_service_account.email}"
}

resource "google_project_iam_member" "swarm_service_account_pubsub" {
  project = var.project_id
  role    = "roles/pubsub.publisher"
  member  = "serviceAccount:${google_service_account.swarm_service_account.email}"
}

resource "google_project_iam_member" "swarm_service_account_cloudsql" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.swarm_service_account.email}"
}

# Secret Manager secrets
resource "google_secret_manager_secret" "db_password" {
  secret_id = "swarm-db-password"
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "db_password_version" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}

resource "google_secret_manager_secret" "gemini_api_key" {
  secret_id = "gemini-api-key"
  replication {
    automatic = true
  }
}

resource "google_secret_manager_secret_version" "gemini_api_key_version" {
  secret      = google_secret_manager_secret.gemini_api_key.id
  secret_data = var.gemini_api_key
}

# Network configuration
resource "google_compute_network" "default" {
  name                    = "swarm-network"
  auto_create_subnetworks = true
}

# VPC Connector for Cloud Run to access VPC resources
resource "google_vpc_access_connector" "swarm_connector" {
  name          = "swarm-connector"
  region        = var.region
  subnet {
    name = google_compute_subnetwork.default.name
  }
}

resource "google_compute_subnetwork" "default" {
  name          = "swarm-subnet"
  ip_cidr_range = "10.0.0.0/16"
  region        = var.region
  network       = google_compute_network.default.id
}