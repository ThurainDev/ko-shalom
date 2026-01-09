const mongoose = require('mongoose');
const Content = require('../models/Content');
require('dotenv').config();

const mongoURL = "mongodb+srv://thuraindev:712127@thuraindev.ulnnx.mongodb.net/?retryWrites=true&w=majority&appName=ThurainDev";

const defaultContent = [
  // Home Page Content
  {
    section: 'hero',
    page: 'home',
    title: 'Shalom',
    subtitle: 'Musician • Composer • Performer',
    buttonText: 'Listen Now',
    buttonLink: '/product',
    secondaryButtonText: 'Explore Music',
    secondaryButtonLink: '/about',
    order: 1
  },
  {
    section: 'about',
    page: 'home',
    title: 'About Me',
    description: '<p>Shalom is a versatile musician with over 10 years of experience in composing, performing, and producing music across various genres.</p><p>With a unique approach to blending traditional and contemporary sounds, Ko has established a distinctive musical identity that resonates with audiences worldwide.</p>',
    buttonText: 'Read More',
    buttonLink: '/about',
    order: 2
  },
  {
    section: 'events',
    page: 'home',
    title: 'Upcoming Events',
    items: [
      {
        title: 'Summer Concert Series',
        venue: 'Central Park, New York',
        date: 'July 15, 2024',
        time: '8:00 PM',
        description: 'An evening of acoustic melodies under the stars',
        buttonText: 'Get Tickets',
        link: '#'
      },
      {
        title: 'Jazz Festival Performance',
        venue: 'Blue Note Jazz Club',
        date: 'August 22, 2024',
        time: '9:30 PM',
        description: 'Special guest appearance at the annual jazz festival',
        buttonText: 'Reserve Seats',
        link: '#'
      }
    ],
    order: 3
  },
  {
    section: 'contact',
    page: 'home',
    title: 'Get In Touch',
    description: 'Ready to collaborate or just want to say hello? I\'d love to hear from you.',
    buttonText: 'Contact Me',
    buttonLink: '/contact',
    order: 4
  },

  // About Page Content
  {
    section: 'about-hero',
    page: 'about',
    title: 'About Shalom',
    subtitle: 'The Story Behind the Music',
    description: 'Discover the journey of a passionate musician dedicated to creating meaningful connections through sound.',
    order: 1
  },
  {
    section: 'about-journey',
    page: 'about',
    title: 'Musical Journey',
    description: '<p>My musical journey began at the age of 8 when I first picked up a guitar. Since then, I\'ve explored various instruments and genres, always seeking to push the boundaries of what\'s possible in music.</p><p>From classical training to contemporary experimentation, every experience has shaped my unique sound and approach to composition.</p>',
    order: 2
  },
  {
    section: 'about-awards',
    page: 'about',
    title: 'Awards & Recognition',
    items: [
      {
        title: 'Best New Artist',
        subtitle: 'Independent Music Awards',
        date: '2023',
        description: 'Recognized for innovative approach to contemporary music'
      },
      {
        title: 'Excellence in Composition',
        subtitle: 'International Music Festival',
        date: '2022',
        description: 'Awarded for outstanding original compositions'
      }
    ],
    order: 3
  },
  {
    section: 'about-style',
    page: 'about',
    title: 'Musical Style',
    description: '<p>My music blends elements of jazz, classical, and contemporary styles, creating a unique fusion that defies easy categorization. I believe in the power of music to transcend boundaries and connect people across cultures and experiences.</p><p>Each composition is crafted with attention to detail, emotion, and the desire to create something truly meaningful.</p>',
    order: 4
  },
  {
    section: 'about-philosophy',
    page: 'about',
    title: 'Philosophy',
    description: '<p>Music is more than just sound—it\'s a language that speaks to the soul. My philosophy centers around creating authentic, emotionally resonant music that moves listeners and creates lasting connections.</p><p>I believe in the transformative power of music and its ability to heal, inspire, and bring people together.</p>',
    order: 5
  },

  // Product Page Content
  {
    section: 'product-hero',
    page: 'product',
    title: 'Music Catalog',
    subtitle: 'Explore My Latest Releases',
    description: 'Discover a diverse collection of original compositions, from intimate acoustic pieces to full orchestral arrangements.',
    order: 1
  },
  {
    section: 'product-streaming',
    page: 'product',
    title: 'Streaming Platforms',
    items: [
      {
        title: 'Spotify',
        link: 'https://spotify.com',
        buttonText: 'Listen on Spotify'
      },
      {
        title: 'Apple Music',
        link: 'https://music.apple.com',
        buttonText: 'Listen on Apple Music'
      },
      {
        title: 'YouTube',
        link: 'https://youtube.com',
        buttonText: 'Watch on YouTube'
      },
      {
        title: 'SoundCloud',
        link: 'https://soundcloud.com',
        buttonText: 'Listen on SoundCloud'
      }
    ],
    order: 2
  },
  {
    section: 'product-faq',
    page: 'product',
    title: 'Frequently Asked Questions',
    items: [
      {
        title: 'How can I purchase your music?',
        description: 'My music is available on all major streaming platforms and digital stores. Physical copies can be ordered through my website.'
      },
      {
        title: 'Do you perform live?',
        description: 'Yes! I regularly perform live shows and participate in music festivals. Check the events section for upcoming performances.'
      },
      {
        title: 'Can I use your music in my project?',
        description: 'For licensing inquiries, please contact me directly through the contact form. I\'m always open to creative collaborations.'
      }
    ],
    order: 3
  },

  // Contact Page Content
  {
    section: 'contact-hero',
    page: 'contact',
    title: 'Get In Touch',
    subtitle: 'Let\'s Connect',
    description: 'Whether you\'re interested in collaboration, booking a performance, or just want to say hello, I\'d love to hear from you.',
    order: 1
  },
  {
    section: 'contact-faq',
    page: 'contact',
    title: 'Contact Information',
    items: [
      {
        title: 'Booking Inquiries',
        description: 'For performance bookings and event appearances',
        buttonText: 'Book Now'
      },
      {
        title: 'Press & Media',
        description: 'For press interviews, media coverage, and promotional opportunities',
        buttonText: 'Media Kit'
      },
      {
        title: 'General Inquiries',
        description: 'For general questions, collaborations, or just to say hello',
        buttonText: 'Send Message'
      }
    ],
    order: 2
  },

  // Footer Content
  {
    section: 'footer',
    page: 'global',
    title: 'Connect With Me',
    socialLinks: {
      instagram: 'https://instagram.com/shalom',
      youtube: 'https://youtube.com/shalom',
      spotify: 'https://open.spotify.com/artist/shalom',
      soundcloud: 'https://soundcloud.com/shalom',
      appleMusic: 'https://music.apple.com/artist/shalom'
    },
    order: 1
  }
];

async function initializeContent() {
  try {
    await mongoose.connect(mongoURL);
    console.log('Connected to MongoDB');

    // Clear existing content
    await Content.deleteMany({});
    console.log('Cleared existing content');

    // Insert default content
    const result = await Content.insertMany(defaultContent);
    console.log(`Successfully initialized ${result.length} content items`);

    console.log('Content initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing content:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initializeContent(); 