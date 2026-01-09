const mongoose = require('mongoose');
const AboutContent = require('../models/AboutContent');
require('dotenv').config();

const mongoURL = "mongodb+srv://thuraindev:712127@thuraindev.ulnnx.mongodb.net/?retryWrites=true&w=majority&appName=ThurainDev";

const defaultAboutContent = [
  // Hero Section
  {
    section: 'hero',
    title: 'About Shalom',
    subtitle: 'The Artist',
    description: '<p>Shalom is an acclaimed musician, composer, and performer with a passion for creating music that transcends boundaries and connects with people on a profound level.</p><p>Born in Myanmar and raised in a family of musicians, Ko\'s journey began at an early age when he first picked up a guitar at the age of seven. His unique approach to blending traditional Asian influences with contemporary Western sounds has earned him recognition across the global music scene.</p><p>With over a decade of experience performing in venues around the world, Ko continues to push the boundaries of musical expression while staying true to his artistic vision.</p>',
    isActive: true
  },
  // Musical Journey Section
  {
    section: 'musical-journey',
    title: 'Musical Journey',
    items: [
      {
        timeLine: "2010-2013",
        title: "Early Beginnings",
        description: "Started performing in local venues and released first EP \"Echoes of Dawn\" which gained attention in the independent music scene. Formed the band \"Celestial Harmonies\" and toured across Southeast Asia."
      },
      {
        timeLine: "2014-2017",
        title: "Rising Recognition",
        description: "Signed with Harmony Records and released debut album \"Transcendent Rhythms\" which reached #3 on the Asian Music Charts. Collaborated with renowned producers and performed at major music festivals including SoundWave and Harmony Fest."
      },
      {
        timeLine: "2018-Present",
        title: "Global Impact",
        description: "Released critically acclaimed albums \"Ethereal Connections\" and \"Boundless\" which showcased a mature evolution in musical style. Embarked on world tours across Asia, Europe, and North America. Founded the music education initiative \"Harmonize\" to support young musicians."
      }
    ],
    isActive: true
  },
  // Musical Style Section
  {
    section: 'musical-style',
    title: 'Musical Style',
    description: '<p>My music is a fusion of traditional Asian melodies with contemporary Western arrangements, creating a unique sound that bridges cultural divides. I draw inspiration from classical compositions, jazz improvisation, and modern electronic elements.</p><p>Each piece is crafted with attention to emotional depth and technical precision, aiming to create an immersive experience that resonates with listeners across different backgrounds and musical preferences.</p>',
    isActive: true
  },
  // Awards Section
  {
    section: 'awards',
    title: 'Awards & Recognition',
    items: [
      {
        timeLine: "2023",
        title: "Best New Artist",
        description: "Independent Music Awards - Recognized for innovative approach to contemporary music"
      },
      {
        timeLine: "2022",
        title: "Excellence in Composition",
        description: "International Music Festival - Awarded for outstanding original compositions"
      },
      {
        timeLine: "2021",
        title: "Cultural Ambassador",
        description: "Asian Music Association - Honored for promoting cultural exchange through music"
      }
    ],
    isActive: true
  },
  // Philosophy Section
  {
    section: 'philosophy',
    title: 'Philosophy',
    description: '<p>Music is more than just sound—it\'s a language that speaks to the soul. My philosophy centers around creating authentic, emotionally resonant music that moves listeners and creates lasting connections.</p><p>I believe in the transformative power of music and its ability to heal, inspire, and bring people together. Every composition is an opportunity to share a piece of my journey and connect with others on a deeper level.</p><p>Through my music, I strive to bridge cultural gaps, celebrate diversity, and create moments of unity that transcend language and borders.</p>',
    isActive: true
  }
];

async function initializeAboutContent() {
  try {
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');

    // Clear existing about content
    await AboutContent.deleteMany({});
    console.log('Cleared existing about content');

    // Insert default about content
    const result = await AboutContent.insertMany(defaultAboutContent);
    console.log(`Successfully initialized ${result.length} about content items`);

    console.log('About content initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing about content:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initializeAboutContent(); 