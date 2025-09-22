import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

async function createSuperAdmin() {
  try {
    console.log('🔄 Connecting to database...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'einsteinzaza00@gmail.com';
    const adminPassword = 'Ihimbru.7';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('⚠️  Super admin already exists with this email');
      console.log('📧 Email:', existingAdmin.email);
      console.log('👤 Name:', existingAdmin.name);
      console.log('🔑 Role:', existingAdmin.role);
      console.log('📅 Created:', existingAdmin.createdAt);

      // Update password if needed
      existingAdmin.password = adminPassword;
      existingAdmin.name = 'Super Admin';
      existingAdmin.role = 'SUPER_ADMIN';
      await existingAdmin.save(); // This will trigger the pre-save hook to hash the password

      console.log('✅ Admin password updated successfully');
    } else {
      // Create new super admin
      console.log('👤 Creating new super admin...');

      const superAdmin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword, // Will be hashed by the pre-save hook
        role: 'SUPER_ADMIN'
      });

      await superAdmin.save();

      console.log('✅ Super admin created successfully!');
      console.log('📧 Email:', superAdmin.email);
      console.log('👤 Name:', superAdmin.name);
      console.log('🔑 Role:', superAdmin.role);
      console.log('🆔 ID:', superAdmin._id);
      console.log('📅 Created:', superAdmin.createdAt);
    }

    console.log('\n🎉 Super Admin Setup Complete!');
    console.log('📋 Login Credentials:');
    console.log('   Email: einsteinzaza00@gmail.com');
    console.log('   Password: Ihimbru.7');
    console.log('\n🔗 You can now login via:');
    console.log('   POST /api/users/login');
    console.log('   Or use Swagger UI: http://localhost:5000/api-docs');

  } catch (error) {
    console.error('❌ Error creating super admin:', error);

    if (error.code === 11000) {
      console.log('💡 This usually means the email already exists in the database');
    }
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the script
createSuperAdmin();