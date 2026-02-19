import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { env } from '../config/env';
import { User } from '../models/User';
import { Lead } from '../models/Lead';
import { Task } from '../models/Task';
import { Activity } from '../models/Activity';
import {
  UserRole,
  LeadChannel,
  LeadStatus,
  TaskStatus,
  TaskPriority,
  ActivityType,
} from '../types';

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log('🌱 Starting database seed...\n');

    // ─── Create Super Admin (drop & recreate to ensure clean credentials) ───
    await User.deleteMany({});
    const adminUser = await User.create({
      name: 'Jason Berry',
      username: '2026-00001',
      password: 'superadmin@123!',
      role: UserRole.SUPER_ADMIN,
      email: 'jason.berry@actionauto.com',
      phone: '(555) 100-0001',
      isActive: true,
    });
    console.log('✅ Super Admin created:');
    console.log('   Name: Jason Berry');
    console.log('   Username: 2026-00001');
    console.log('   Password: superadmin@123!');
    console.log('   Role: Super Admin\n');

    // ─── Sample Leads (Emails) ───────────────────────────
    const emailLeads = [
      {
        customerName: 'Maria Santos',
        email: 'maria.santos@email.com',
        phone: '(555) 201-1001',
        channel: LeadChannel.EMAIL,
        status: LeadStatus.NEW,
        subject: 'Interested in 2026 Honda Civic',
        message: 'Hi, I saw the 2026 Honda Civic listed on your website. I would like to schedule a test drive this weekend. Please let me know available times. Thank you!',
        vehicleInterest: '2026 Honda Civic',
        source: 'Website',
      },
      {
        customerName: 'James Rivera',
        email: 'j.rivera@gmail.com',
        phone: '(555) 201-1002',
        channel: LeadChannel.EMAIL,
        status: LeadStatus.CONTACTED,
        subject: 'Trade-in inquiry for my 2022 Toyota Camry',
        message: 'I am interested in trading in my 2022 Toyota Camry for a newer SUV model. Could you provide me with a trade-in estimate and available SUV inventory?',
        vehicleInterest: 'SUV Models',
        source: 'Referral',
      },
      {
        customerName: 'Angela Cruz',
        email: 'angela.c@yahoo.com',
        phone: '(555) 201-1003',
        channel: LeadChannel.EMAIL,
        status: LeadStatus.NEW,
        subject: 'Financing options for Ford F-150',
        message: 'Hello, I would like to know what financing options are available for the 2025 Ford F-150 XLT. My credit score is around 720. What monthly payment can I expect?',
        vehicleInterest: '2025 Ford F-150 XLT',
        source: 'AutoTrader',
      },
      {
        customerName: 'Robert Kim',
        email: 'robert.kim@corporate.com',
        phone: '(555) 201-1004',
        channel: LeadChannel.EMAIL,
        status: LeadStatus.QUALIFIED,
        subject: 'Fleet purchase — 5 vehicles',
        message: 'Our company is looking to purchase 5 sedans for our fleet. We need reliable, fuel-efficient vehicles. Can you prepare a fleet pricing proposal?',
        vehicleInterest: 'Fleet Sedans',
        source: 'LinkedIn',
      },
      {
        customerName: 'Diana Moore',
        email: 'diana.m@outlook.com',
        channel: LeadChannel.EMAIL,
        status: LeadStatus.NEW,
        subject: 'Service appointment request',
        message: 'My 2023 Chevrolet Equinox is due for its 30,000-mile service. I would also like the brakes inspected. What is the earliest appointment available?',
        vehicleInterest: 'Service',
        source: 'Website',
      },
    ];

    // ─── Sample Leads (SMS) ──────────────────────────────
    const smsLeads = [
      {
        customerName: 'Carlos Mendez',
        phone: '(555) 302-2001',
        channel: LeadChannel.SMS,
        status: LeadStatus.NEW,
        message: 'Hey, is the red 2025 Mustang GT still available? Saw it on your lot yesterday.',
        vehicleInterest: '2025 Ford Mustang GT',
        source: 'Walk-in',
      },
      {
        customerName: 'Patricia Lee',
        phone: '(555) 302-2002',
        channel: LeadChannel.SMS,
        status: LeadStatus.CONTACTED,
        message: 'Thanks for the call back. Yes, I can come in Thursday at 3pm for the test drive.',
        vehicleInterest: '2026 Toyota RAV4',
        source: 'Phone',
      },
      {
        customerName: 'Michael Johnson',
        phone: '(555) 302-2003',
        channel: LeadChannel.SMS,
        status: LeadStatus.NEW,
        message: 'Do you have any electric vehicles in stock? Looking for something under $45K.',
        vehicleInterest: 'Electric Vehicles',
        source: 'SMS Campaign',
      },
      {
        customerName: 'Sarah Williams',
        phone: '(555) 302-2004',
        channel: LeadChannel.SMS,
        status: LeadStatus.NEW,
        message: 'Hi, my name is Sarah. Im looking for a reliable family minivan. What do you have?',
        vehicleInterest: 'Minivan',
        source: 'Referral',
      },
      {
        customerName: 'David Chen',
        phone: '(555) 302-2005',
        channel: LeadChannel.SMS,
        status: LeadStatus.QUALIFIED,
        message: 'Ready to finalize the deal on the Accord. Can we meet tomorrow morning?',
        vehicleInterest: '2025 Honda Accord',
        source: 'Website',
      },
    ];

    await Lead.deleteMany({});
    await Lead.insertMany([...emailLeads, ...smsLeads]);
    console.log(`${emailLeads.length + smsLeads.length} sample leads created.\n`);

    // ─── Sample Tasks ────────────────────────────────────
    const now = new Date();
    const tasks = [
      {
        title: 'Follow up with Maria Santos — Civic test drive',
        description: 'Maria expressed interest in 2026 Honda Civic. Schedule test drive for this weekend.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Prepare fleet pricing proposal for Robert Kim',
        description: 'Robert needs pricing for 5 fleet sedans. Prepare detailed proposal with volume discounts.',
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.URGENT,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Process trade-in appraisal — James Rivera',
        description: 'Appraise 2022 Toyota Camry for trade-in value.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        dueDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Send financing pre-approval to Angela Cruz',
        description: 'Run credit check and prepare financing options for F-150 XLT.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.MEDIUM,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // Overdue
      },
      {
        title: 'Complete vehicle detail — 2025 Mustang GT',
        description: 'Full detail and photography for lot display.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.LOW,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        dueDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // Overdue
      },
      {
        title: 'Update website inventory listings',
        description: 'Add 8 new arrivals to website with photos and pricing.',
        status: TaskStatus.PENDING,
        priority: TaskPriority.HIGH,
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      },
    ];

    await Task.deleteMany({});
    await Task.insertMany(tasks);
    console.log(`✅ ${tasks.length} sample tasks created.\n`);

    // ─── Sample Activities ───────────────────────────────
    const activities = [
      {
        title: 'Test Drive — Maria Santos (Honda Civic)',
        type: ActivityType.TEST_DRIVE,
        description: 'Customer coming in for test drive of 2026 Honda Civic.',
        scheduledAt: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        location: 'Main Showroom',
      },
      {
        title: 'Follow-up Call — Patricia Lee',
        type: ActivityType.CALL,
        description: 'Confirm Thursday 3pm test drive appointment for RAV4.',
        scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
      },
      {
        title: 'Fleet Meeting — Robert Kim',
        type: ActivityType.MEETING,
        description: 'Present fleet pricing proposal. Bring comparison sheets.',
        scheduledAt: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        location: 'Conference Room A',
      },
      {
        title: 'Vehicle Delivery — David Chen (Honda Accord)',
        type: ActivityType.DELIVERY,
        description: 'Final paperwork signing and vehicle delivery.',
        scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        location: 'Delivery Bay',
      },
      {
        title: 'Service Appointment — Diana Moore',
        type: ActivityType.SERVICE,
        description: '30,000-mile service + brake inspection for 2023 Equinox.',
        scheduledAt: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        location: 'Service Center',
      },
      {
        title: 'Morning Sales Team Huddle',
        type: ActivityType.MEETING,
        description: 'Daily sales pipeline review and target check-in.',
        scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        assignedTo: adminUser._id,
        createdBy: adminUser._id,
        location: 'Sales Floor',
      },
    ];

    await Activity.deleteMany({});
    await Activity.insertMany(activities);
    console.log(`${activities.length} sample activities created.\n`);

    console.log('═══════════════════════════════════════════');
    console.log('  Database seeded successfully!');
    console.log('═══════════════════════════════════════════');
    console.log('\n  Login Credentials:');
    console.log('  Username: 2026-00001');
    console.log('  Password: superadmin@123!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('eed error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();