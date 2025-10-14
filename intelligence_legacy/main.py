#!/usr/bin/env python3
"""
Intelligence module CLI - Main entry point for all AI/LLM tasks
"""
import sys
import argparse

from intelligence.src.job_posting import enhance_job_posting
from intelligence.src.company.main import enhance_company
from intelligence.src.match import create_potential_match


def main():
    parser = argparse.ArgumentParser(
        description='Intelligence module for job posting and company enhancement'
    )

    subparsers = parser.add_subparsers(dest='command', help='Available commands')

    # Job posting enhancement command
    job_parser = subparsers.add_parser('enhance-job', help='Enhance a job posting')
    job_parser.add_argument('job_id', help='Job posting ID to enhance')

    # Company enhancement command
    company_parser = subparsers.add_parser('enhance-company', help='Enhance a company profile')
    company_parser.add_argument('company_id', help='Company ID to enhance')

    # Job matching command
    match_parser = subparsers.add_parser('match', help='Create a potential job match for a candidate')
    match_parser.add_argument('candidate_id', help='Candidate ID for job matching')
    match_parser.add_argument('job_id', help='Job posting ID to match')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    # Route to appropriate function
    if args.command == 'enhance-job':
        enhance_job_posting(args.job_id)
    elif args.command == 'enhance-company':
        enhance_company(args.company_id)
    elif args.command == 'match':
        create_potential_match(args.candidate_id, args.job_id)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
