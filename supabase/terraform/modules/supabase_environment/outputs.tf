output "project_id" {
  description = "Supabase project identifier."
  value       = supabase_project.this.id
}

output "project_name" {
  description = "Supabase project name."
  value       = supabase_project.this.name
}

output "organization_id" {
  description = "Supabase organization identifier."
  value       = supabase_project.this.organization_id
}

output "region" {
  description = "Supabase project region."
  value       = supabase_project.this.region
}

output "instance_size" {
  description = "Supabase project instance size."
  value       = supabase_project.this.instance_size
}
