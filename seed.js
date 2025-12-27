const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/gearguard';

const TeamSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const EquipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  employee: { type: String, required: true },
  maintenanceTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
  purchaseDate: { type: Date, required: true },
  warrantyInfo: { type: String },
  location: { type: String, required: true },
  isScrapped: { type: Boolean, default: false },
  category: { type: String, required: true },
  maintenanceType: { type: String, enum: ['equipment', 'workspace'], required: true },
});

const Team = mongoose.models.Team || mongoose.model('Team', TeamSchema);
const Equipment = mongoose.models.Equipment || mongoose.model('Equipment', EquipmentSchema);

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected!');

    await Equipment.deleteMany({});
    await Team.deleteMany({});
    console.log('Cleared existing data');

    console.log('Creating maintenance teams...');
    const teams = {
      it: await Team.create({ name: 'IT Support' }),
      hvac: await Team.create({ name: 'HVAC Team' }),
      electrical: await Team.create({ name: 'Electrical Team' }),
      plumbing: await Team.create({ name: 'Plumbing Team' }),
      facilities: await Team.create({ name: 'Facilities Management' }),
      machinery: await Team.create({ name: 'Heavy Machinery Team' }),
      vehicles: await Team.create({ name: 'Vehicle Maintenance' }),
    };
    console.log('Teams created!');

    const equipmentData = [
      // IT EQUIPMENT (equipment type)
      { name: 'Dell Desktop Computer', serialNumber: 'IT-PC-001', department: 'Finance', employee: 'Sarah Johnson', maintenanceTeam: teams.it._id, purchaseDate: new Date('2023-03-15'), warrantyInfo: '3 Year Dell Warranty', location: 'Floor 2 - Office 201', category: 'Computers', maintenanceType: 'equipment' },
      { name: 'HP Laptop ProBook', serialNumber: 'IT-LP-002', department: 'Marketing', employee: 'John Smith', maintenanceTeam: teams.it._id, purchaseDate: new Date('2023-06-20'), warrantyInfo: '2 Year HP Warranty', location: 'Floor 3 - Office 305', category: 'Computers', maintenanceType: 'equipment' },
      { name: 'MacBook Pro 16"', serialNumber: 'IT-MAC-003', department: 'Design', employee: 'Emily Davis', maintenanceTeam: teams.it._id, purchaseDate: new Date('2024-01-10'), warrantyInfo: 'AppleCare+', location: 'Floor 3 - Creative Studio', category: 'Computers', maintenanceType: 'equipment' },
      { name: 'HP LaserJet Printer', serialNumber: 'IT-PRT-004', department: 'Admin', employee: 'Reception', maintenanceTeam: teams.it._id, purchaseDate: new Date('2022-11-05'), warrantyInfo: '1 Year HP Warranty', location: 'Floor 1 - Reception', category: 'Printers', maintenanceType: 'equipment' },
      { name: 'Cisco Network Switch', serialNumber: 'IT-NET-005', department: 'IT', employee: 'Network Team', maintenanceTeam: teams.it._id, purchaseDate: new Date('2023-08-12'), warrantyInfo: '5 Year Cisco Support', location: 'Server Room', category: 'Networking', maintenanceType: 'equipment' },
      { name: 'Dell Server PowerEdge', serialNumber: 'IT-SRV-006', department: 'IT', employee: 'Server Team', maintenanceTeam: teams.it._id, purchaseDate: new Date('2023-02-28'), warrantyInfo: '5 Year Dell ProSupport', location: 'Server Room - Rack A', category: 'Servers', maintenanceType: 'equipment' },
      { name: 'Samsung Monitor 27"', serialNumber: 'IT-MON-007', department: 'Sales', employee: 'Mike Wilson', maintenanceTeam: teams.it._id, purchaseDate: new Date('2023-09-15'), warrantyInfo: '2 Year Samsung Warranty', location: 'Floor 2 - Office 210', category: 'Monitors', maintenanceType: 'equipment' },
      { name: 'Epson Projector', serialNumber: 'IT-PRJ-008', department: 'Training', employee: 'HR Team', maintenanceTeam: teams.it._id, purchaseDate: new Date('2022-07-20'), warrantyInfo: '2 Year Epson Warranty', location: 'Conference Room A', category: 'AV Equipment', maintenanceType: 'equipment' },

      // HVAC EQUIPMENT (equipment type)
      { name: 'Central Air Conditioning Unit', serialNumber: 'HVAC-AC-001', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.hvac._id, purchaseDate: new Date('2020-05-10'), warrantyInfo: '10 Year Carrier Warranty', location: 'Rooftop - Unit A', category: 'Air Conditioning', maintenanceType: 'equipment' },
      { name: 'Industrial Heating Boiler', serialNumber: 'HVAC-HT-002', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.hvac._id, purchaseDate: new Date('2019-11-20'), warrantyInfo: '15 Year Warranty', location: 'Basement - Boiler Room', category: 'Heating', maintenanceType: 'equipment' },
      { name: 'Ventilation Fan System', serialNumber: 'HVAC-VN-003', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.hvac._id, purchaseDate: new Date('2021-03-15'), warrantyInfo: '5 Year Warranty', location: 'Rooftop - Ventilation Unit', category: 'Ventilation', maintenanceType: 'equipment' },
      { name: 'Split AC Unit - Floor 2', serialNumber: 'HVAC-SP-004', department: 'Operations', employee: 'Floor Manager', maintenanceTeam: teams.hvac._id, purchaseDate: new Date('2022-06-10'), warrantyInfo: '3 Year Daikin Warranty', location: 'Floor 2 - Open Office', category: 'Air Conditioning', maintenanceType: 'equipment' },

      // ELECTRICAL EQUIPMENT (equipment type)
      { name: 'Main Electrical Panel', serialNumber: 'ELEC-PNL-001', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.electrical._id, purchaseDate: new Date('2018-01-15'), warrantyInfo: '20 Year Warranty', location: 'Basement - Electrical Room', category: 'Electrical Panels', maintenanceType: 'equipment' },
      { name: 'Emergency Generator', serialNumber: 'ELEC-GEN-002', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.electrical._id, purchaseDate: new Date('2020-08-20'), warrantyInfo: '10 Year Caterpillar Warranty', location: 'Parking Lot - Generator House', category: 'Generators', maintenanceType: 'equipment' },
      { name: 'UPS System 10kVA', serialNumber: 'ELEC-UPS-003', department: 'IT', employee: 'Server Team', maintenanceTeam: teams.electrical._id, purchaseDate: new Date('2022-04-10'), warrantyInfo: '5 Year APC Warranty', location: 'Server Room', category: 'UPS Systems', maintenanceType: 'equipment' },

      // HEAVY MACHINERY (equipment type)
      { name: 'Industrial CNC Machine', serialNumber: 'MACH-CNC-001', department: 'Manufacturing', employee: 'Production Team', maintenanceTeam: teams.machinery._id, purchaseDate: new Date('2021-07-15'), warrantyInfo: '5 Year Warranty', location: 'Factory Floor - Section A', category: 'CNC Machines', maintenanceType: 'equipment' },
      { name: 'Hydraulic Press 100T', serialNumber: 'MACH-PRS-002', department: 'Manufacturing', employee: 'Production Team', maintenanceTeam: teams.machinery._id, purchaseDate: new Date('2020-03-20'), warrantyInfo: '3 Year Warranty', location: 'Factory Floor - Section B', category: 'Presses', maintenanceType: 'equipment' },
      { name: 'Industrial Lathe', serialNumber: 'MACH-LTH-003', department: 'Manufacturing', employee: 'Production Team', maintenanceTeam: teams.machinery._id, purchaseDate: new Date('2019-11-10'), warrantyInfo: '2 Year Warranty', location: 'Factory Floor - Section C', category: 'Lathes', maintenanceType: 'equipment' },
      { name: 'Welding Station', serialNumber: 'MACH-WLD-004', department: 'Manufacturing', employee: 'Welding Team', maintenanceTeam: teams.machinery._id, purchaseDate: new Date('2022-02-28'), warrantyInfo: '3 Year Lincoln Warranty', location: 'Factory Floor - Welding Bay', category: 'Welding Equipment', maintenanceType: 'equipment' },

      // VEHICLES (equipment type)
      { name: 'Forklift Toyota 8FGU25', serialNumber: 'VEH-FLT-001', department: 'Warehouse', employee: 'Logistics Team', maintenanceTeam: teams.vehicles._id, purchaseDate: new Date('2021-05-15'), warrantyInfo: '3 Year Toyota Warranty', location: 'Warehouse A', category: 'Forklifts', maintenanceType: 'equipment' },
      { name: 'Company Van - Ford Transit', serialNumber: 'VEH-VAN-002', department: 'Delivery', employee: 'Delivery Team', maintenanceTeam: teams.vehicles._id, purchaseDate: new Date('2022-08-20'), warrantyInfo: '5 Year Ford Warranty', location: 'Parking Lot - Bay 1', category: 'Vans', maintenanceType: 'equipment' },
      { name: 'Electric Pallet Jack', serialNumber: 'VEH-PLT-003', department: 'Warehouse', employee: 'Warehouse Team', maintenanceTeam: teams.vehicles._id, purchaseDate: new Date('2023-01-10'), warrantyInfo: '2 Year Warranty', location: 'Warehouse B', category: 'Pallet Jacks', maintenanceType: 'equipment' },

      // WORKSPACE ITEMS (workspace type)
      { name: 'Conference Room A - Lighting', serialNumber: 'WS-LGT-001', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2021-01-15'), warrantyInfo: 'N/A', location: 'Floor 1 - Conference Room A', category: 'Lighting', maintenanceType: 'workspace' },
      { name: 'Executive Office - Blinds', serialNumber: 'WS-BLD-002', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2020-06-20'), warrantyInfo: 'N/A', location: 'Floor 4 - Executive Suite', category: 'Window Treatments', maintenanceType: 'workspace' },
      { name: 'Main Lobby - Flooring', serialNumber: 'WS-FLR-003', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2019-03-10'), warrantyInfo: '10 Year Warranty', location: 'Floor 1 - Main Lobby', category: 'Flooring', maintenanceType: 'workspace' },
      { name: 'Break Room - Kitchen Equipment', serialNumber: 'WS-KIT-004', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2022-09-15'), warrantyInfo: '2 Year Warranty', location: 'Floor 2 - Break Room', category: 'Kitchen', maintenanceType: 'workspace' },
      { name: 'Restroom Floor 1 - Fixtures', serialNumber: 'WS-RST-005', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.plumbing._id, purchaseDate: new Date('2020-11-20'), warrantyInfo: '5 Year Warranty', location: 'Floor 1 - Restrooms', category: 'Plumbing Fixtures', maintenanceType: 'workspace' },
      { name: 'Parking Lot - Lighting', serialNumber: 'WS-PKL-006', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.electrical._id, purchaseDate: new Date('2021-07-10'), warrantyInfo: '3 Year Warranty', location: 'Outdoor - Parking Lot', category: 'Outdoor Lighting', maintenanceType: 'workspace' },
      { name: 'Open Office Floor 3 - Carpet', serialNumber: 'WS-CPT-007', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2022-01-25'), warrantyInfo: '5 Year Warranty', location: 'Floor 3 - Open Office', category: 'Flooring', maintenanceType: 'workspace' },
      { name: 'Stairwell - Emergency Lights', serialNumber: 'WS-EML-008', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.electrical._id, purchaseDate: new Date('2021-04-15'), warrantyInfo: '5 Year Warranty', location: 'All Floors - Stairwells', category: 'Emergency Systems', maintenanceType: 'workspace' },
      { name: 'Elevator A - Cabin Interior', serialNumber: 'WS-ELV-009', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2018-06-20'), warrantyInfo: '10 Year Service Contract', location: 'Main Building - Elevator A', category: 'Elevators', maintenanceType: 'workspace' },
      { name: 'Cafeteria - Tables & Chairs', serialNumber: 'WS-CAF-010', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2023-02-10'), warrantyInfo: '3 Year Warranty', location: 'Floor 1 - Cafeteria', category: 'Furniture', maintenanceType: 'workspace' },
      { name: 'Training Room - Whiteboard', serialNumber: 'WS-TRN-011', department: 'HR', employee: 'Training Team', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2022-08-05'), warrantyInfo: '2 Year Warranty', location: 'Floor 2 - Training Room', category: 'Office Equipment', maintenanceType: 'workspace' },
      { name: 'Reception Desk Area', serialNumber: 'WS-RCP-012', department: 'Admin', employee: 'Reception', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2020-12-15'), warrantyInfo: 'N/A', location: 'Floor 1 - Reception', category: 'Furniture', maintenanceType: 'workspace' },
      { name: 'Roof Access Door & Lock', serialNumber: 'WS-ROF-013', department: 'Facilities', employee: 'Building Management', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2019-08-20'), warrantyInfo: 'N/A', location: 'Rooftop Access', category: 'Doors & Locks', maintenanceType: 'workspace' },
      { name: 'Fire Suppression System', serialNumber: 'WS-FIR-014', department: 'Facilities', employee: 'Safety Team', maintenanceTeam: teams.facilities._id, purchaseDate: new Date('2018-03-10'), warrantyInfo: 'Annual Service Contract', location: 'All Floors', category: 'Fire Safety', maintenanceType: 'workspace' },
      { name: 'Security Camera System', serialNumber: 'WS-SEC-015', department: 'Security', employee: 'Security Team', maintenanceTeam: teams.it._id, purchaseDate: new Date('2022-05-25'), warrantyInfo: '3 Year Warranty', location: 'All Areas', category: 'Security Systems', maintenanceType: 'workspace' },
    ];

    console.log('Seeding equipment and workspace items...');
    for (const data of equipmentData) {
      try {
        await Equipment.findOneAndUpdate(
          { serialNumber: data.serialNumber },
          data,
          { upsert: true, new: true }
        );
        console.log(`- Seeded: ${data.name} (${data.maintenanceType})`);
      } catch (err) {
        console.error(`Error seeding ${data.name}:`, err.message);
      }
    }

    const counts = {
      equipment: await Equipment.countDocuments({ maintenanceType: 'equipment' }),
      workspace: await Equipment.countDocuments({ maintenanceType: 'workspace' }),
    };

    console.log('\n=== Seeding Summary ===');
    console.log(`Equipment items: ${counts.equipment}`);
    console.log(`Workspace items: ${counts.workspace}`);
    console.log(`Total items: ${counts.equipment + counts.workspace}`);
    console.log('Seeding completed successfully!');
    
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
