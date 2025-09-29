#!/bin/bash

# Script to reset the database and re-run all migrations

echo "🗑️  Removing existing database..."
rm -f job-agent-core.db

echo "📝 Running migrations..."

# Run all .sql files in migrations folder in alphabetical order
for migration in src/db/migrations/*.sql; do
    if [ -f "$migration" ]; then
        echo "  Running: $(basename $migration)"
        sqlite3 job-agent-core.db < "$migration"
    fi
done

echo "✅ Database reset complete!"
echo ""
echo "Tables created:"
sqlite3 job-agent-core.db ".tables"