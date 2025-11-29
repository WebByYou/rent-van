import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding vans...");

  // Clear existing vans (optional, but good for testing)
  // await prisma.van.deleteMany();

  const vans = [
    {
      name: "Hyundai H1 VIP",
      plateNumber: "ฮฮ 1234",
      price: 2500,
      description:
        "รถตู้ Hyundai H1 ตกแต่ง VIP เต็มระบบ เบาะหนังแท้ปรับไฟฟ้า 7 ที่นั่ง พร้อมระบบนวดไฟฟ้า เครื่องเสียงชุดใหญ่ ทีวีดิจิตอล ประตูสไลด์ไฟฟ้าซ้าย-ขวา เหมาะสำหรับผู้บริหารหรือครอบครัวที่ต้องการความสะดวกสบายสูงสุด",
      features: [
        "เบาะ VIP 7 ที่นั่ง",
        "ระบบนวดไฟฟ้า",
        "ทีวีดิจิตอล 24 นิ้ว",
        "เครื่องเสียงชุดใหญ่",
        "ประตูไฟฟ้า",
        "WiFi ฟรี",
      ],
      images: ["/uploads/36a9f348-03a2-439f-8a98-12f15c49d651.jpg"],
      status: "AVAILABLE",
    },
    {
      name: "Toyota Commuter VIP",
      plateNumber: "นข 5678",
      price: 2000,
      description:
        "รถตู้ Toyota Commuter หลังคาสูง ตกแต่ง VIP 9 ที่นั่ง เบาะกว้างนั่งสบาย แอร์ไมโครบัสเย็นฉ่ำทั่วคัน พร้อมคาราโอเกะและไฟเธคสร้างสีสันในการเดินทาง เหมาะสำหรับการท่องเที่ยวเป็นหมู่คณะ",
      features: [
        "เบาะ VIP 9 ที่นั่ง",
        "คาราโอเกะ",
        "ไฟเธค",
        "แอร์ไมโครบัส",
        "ที่ชาร์จ USB ทุกที่นั่ง",
      ],
      images: ["/uploads/59a10a4d-315f-4ef0-a6ea-bde353f61b00.jpg"],
      status: "AVAILABLE",
    },
    {
      name: "Toyota Majesty Grande",
      plateNumber: "ฬอ 9999",
      price: 3500,
      description:
        "ที่สุดแห่งความหรูหรา Toyota Majesty รุ่น Grande เบาะ Captain Seat ปรับไฟฟ้า 4 ที่นั่ง พร้อมระบบบริหารหลัง ช่วงล่างนุ่มนวล เงียบสงบ เป็นส่วนตัวด้วยฉากกั้นห้องโดยสาร เหมาะสำหรับการรับรองแขกคนสำคัญ",
      features: [
        "เบาะ Captain Seat ไฟฟ้า",
        "ฉากกั้นความเป็นส่วนตัว",
        "ช่วงล่างถุงลม",
        "ระบบความปลอดภัย Toyota Safety Sense",
        "โต๊ะทำงานพับเก็บได้",
      ],
      images: ["/uploads/d2eda8f0-4b8b-42d6-920a-c814a0ac4b2b.jpg"],
      status: "AVAILABLE",
    },
    {
      name: "Mercedes-Benz Sprinter",
      plateNumber: "มม 8888",
      price: 4500,
      description:
        "รถตู้หรูขนาดใหญ่ Mercedes-Benz Sprinter รองรับผู้โดยสารได้ถึง 11 ท่าน ห้องโดยสารกว้างขวาง เดินได้ ยืนได้ สะดวกสบายเหมือนนั่งเครื่องบิน First Class พร้อมตู้เย็นและห้องน้ำในตัว (บางรุ่น)",
      features: [
        "11 ที่นั่ง กว้างขวาง",
        "หลังคาสูงโปร่ง",
        "ตู้เย็น",
        "ระบบกันสะเทือนนุ่มนวล",
        "พื้นที่เก็บสัมภาระขนาดใหญ่",
      ],
      images: ["/uploads/e930024d-1b65-4f70-a22f-b1e3c7cd7300.jpg"],
      status: "AVAILABLE",
    },
    {
      name: "Toyota Alphard Executive",
      plateNumber: "กท 1111",
      price: 5500,
      description:
        "รถยนต์อเนกประสงค์หรูระดับผู้นำ Toyota Alphard Executive Lounge เบาะหนัง Semi-Aniline ปรับเอนนอนได้ราบ พร้อมที่รองขา ปรับไฟฟ้าทุกทิศทาง มอบความเป็นส่วนตัวและความสะดวกสบายสูงสุดในการเดินทาง",
      features: [
        "เบาะ Executive Lounge",
        "หลังคา Sunroof",
        "ระบบฟอกอากาศ Nanoe",
        "จอเพดาน",
        "ระบบนำทาง Navigator",
      ],
      images: ["/uploads/f6d49cb7-593f-4e05-a6ae-722e0c085be0.jpg"],
      status: "AVAILABLE",
    },
  ];

  for (const van of vans) {
    await prisma.van.create({
      data: {
        name: van.name,
        plateNumber: van.plateNumber,
        price: van.price,
        description: van.description,
        features: van.features,
        images: van.images,
        status: van.status as any,
      },
    });
    console.log(`Created van: ${van.name}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
