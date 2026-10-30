import { Song, VideoItem, TeamMember, ServiceItem, PricingPackage, TickerItem, NewsPost, SiteContent } from '../types';

export const BRAND_ASSETS = {
  logo: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793365778/file_000000001b348211a217db1b1a5c7635.png',
  logoIcon: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793365764/file_00000000f9548208aa204c34c722b6bf.png',
  heroBanner: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364493/Studio_Banner_Wall_Portraits.png',
  heroSliderImages: [
    'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366305/Official_Zinty_01.png',
    'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366234/Cinematic_Music_Producer_Portrait.png',
    'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364686/file_00000000bb248211ae52b82e10503011.png',
    'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362935/file_00000000a7f88211afb6c4fd65672b92.png',
    'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364493/Studio_Banner_Wall_Portraits.png',
    'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362238/Cinematic_Producer_Portrait_with_Blue_Locs.png',
    'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366475/5_Tips_for_a_DIY_Recording_Studio_at_Home_-_Page_2_of_2_-_Zen_of_Zada.jpg'
  ],
  heroVideo: 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793366427/Coll_s_Records_animation_02.mp4',
  featuredVideo: 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793366427/Coll_s_Records_animation_02.mp4'
};

export const COMPANY_INFO = {
  name: 'Colls Records',
  alternateName: 'Colls Company',
  location: 'Tanga, Tanzania',
  fullAddress: 'Tanga Mjini, Tanga Region, Tanzania',
  email: 'collsrecords.inc@gmail.com',
  youtube: 'https://www.youtube.com/@CollsRecords',
  developerCredit: 'Designed & Developed by Iyan Eman Juma',
  copyright: `© ${new Date().getFullYear()} Colls Records, Tanga, Tanzania. All rights reserved.`,
  producers: [
    {
      id: 'peter-manyama',
      name: 'Peter Manyama',
      stageName: 'New Beats',
      role: 'Chief Producer',
      phone: '+255741808971',
      whatsapp: 'https://wa.me/255741808971',
      photo: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366234/Cinematic_Music_Producer_Portrait.png',
      specialty: 'Afro-Beats, Bongo Flava, Mixing & Studio Direction'
    },
    {
      id: 'jackson-paul',
      name: 'Jackson Paul',
      stageName: 'Jacoh Master',
      role: 'Assistant Producer',
      phone: '+255620742182',
      whatsapp: 'https://wa.me/255620742182',
      photo: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364686/file_00000000bb248211ae52b82e10503011.png',
      specialty: 'Sound Engineering, Audio Mastering & Instrumental Arrangements'
    }
  ]
};

export const INITIAL_SONGS: Song[] = [
  {
    id: 'song-1',
    title: 'Msaliti (Official Audio)',
    artist: 'Colls Records',
    featured_artists: 'Colls Family',
    producer: 'Peter Manyama (New Beats)',
    cover_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364493/Studio_Banner_Wall_Portraits.png',
    audio_url: 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793366699/Msaliti_Official_Audio_by_Colls_Records.wav',
    youtube_url: 'https://www.youtube.com/@CollsRecords',
    genre: 'Bongo Flava / Afro-Fusion',
    release_date: '2025-11-14',
    description: 'The monumental studio release from Colls Records capturing heart-rending melodic flows and signature Tanga coastal grooves.',
    play_count: 2480,
    is_published: true,
    duration: '3:45'
  },
  {
    id: 'song-2',
    title: 'Don Salale',
    artist: 'Iyan Eman',
    featured_artists: 'Zinty',
    producer: 'Colls Records & Jacoh Master',
    cover_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362935/file_00000000a7f88211afb6c4fd65672b92.png',
    audio_url: 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793367458/Don_Salale_Iyan_eman_ft_Zinty_Visualizer_Produced_by_Colls_Records_Jacoh_Master.mp3',
    youtube_url: 'https://www.youtube.com/@CollsRecords',
    genre: 'Urban Afro / Visualizer Hit',
    release_date: '2026-01-20',
    description: 'Electric synergy between Iyan Eman and vocal powerhouse Zinty, produced with precision engineering at Colls Records.',
    play_count: 5120,
    is_published: true,
    duration: '3:22'
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: "Colls Records Brand Visualizer & Studio Anthem",
    video_url: 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793366427/Coll_s_Records_animation_02.mp4',
    youtube_url: 'https://www.youtube.com/@CollsRecords',
    thumbnail_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364493/Studio_Banner_Wall_Portraits.png',
    category: 'behind_the_scenes',
    description: 'The signature animated brand showcase revealing Colls Records sonic architecture and creative vision.',
    is_featured: true,
    is_published: true
  },
  {
    id: 'vid-2',
    title: "Don Salale (Official Visualizer) - Iyan Eman ft. Zinty",
    youtube_url: 'https://www.youtube.com/@CollsRecords',
    thumbnail_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366305/Official_Zinty_01.png',
    category: 'music_video',
    description: 'Dynamic studio visualizer shot and produced in Tanga, Tanzania by the Colls Records creative film unit.',
    is_featured: false,
    is_published: true
  },
  {
    id: 'vid-3',
    title: "Tanga to the World: The Colls Records Documentary",
    youtube_url: 'https://www.youtube.com/@CollsRecords',
    thumbnail_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366475/5_Tips_for_a_DIY_Recording_Studio_at_Home_-_Page_2_of_2_-_Zen_of_Zada.jpg',
    category: 'documentary',
    description: 'An intimate behind-the-scenes look at how Colls Records is empowering East African musical talent and storytelling.',
    is_featured: false,
    is_published: true
  }
];

export const INITIAL_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    full_name: 'Kelvin Lyamuya',
    role: 'Chief Executive Officer (CEO)',
    bio: 'Visionary leader orchestrating Colls Records international expansion, talent acquisition, and creative enterprise throughout East Africa and beyond.',
    photo_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362643/CEO.png',
    display_order: 1,
    is_active: true,
    joined_date: '2023-01-01',
    email: 'kelvin@collsrecords.com'
  },
  {
    id: 'team-2',
    full_name: 'Ashrack Miraji',
    role: 'Marketing Manager',
    bio: 'Strategic brand architect overseeing artist PR, global digital streaming partnerships, tour promotions, and commercial corporate partnerships.',
    photo_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362703/Marketing_manager.png',
    display_order: 2,
    is_active: true,
    joined_date: '2023-03-15',
    email: 'marketing@collsrecords.com'
  },
  {
    id: 'team-3',
    full_name: 'Iyan Eman Juma',
    stage_name: 'Iyan Eman',
    role: 'Head of Digital, Multimedia & Brand Growth',
    bio: 'The creative catalyst behind Colls Records digital presence, web architecture, UI/UX systems, visual storytelling, and viral growth campaigns.',
    photo_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362831/NEW_ERA_2026.jpg',
    display_order: 3,
    is_active: true,
    joined_date: '2023-02-10',
    email: 'iyan@collsrecords.com',
    socials: {
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com/@CollsRecords'
    }
  },
  {
    id: 'team-4',
    full_name: 'Peter Manyama',
    stage_name: 'New Beats',
    role: 'Chief Producer',
    bio: 'Legendary sound sculptor with acoustic mastery in Afro-Beats, Amapiano, Singeli, and R&B. Lead engineer on Colls Records top-charting records.',
    photo_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362238/Cinematic_Producer_Portrait_with_Blue_Locs.png',
    phone: '+255741808971',
    whatsapp: 'https://wa.me/255741808971',
    display_order: 4,
    is_active: true,
    joined_date: '2023-01-15'
  },
  {
    id: 'team-5',
    full_name: 'Jackson Paul',
    stage_name: 'Jacoh Master',
    role: 'Assistant Producer & Audio Engineer',
    bio: 'Precision mixing and mastering virtuoso specializing in acoustic clarity, spatial dynamics, vocal layering, and multi-track stems balancing.',
    photo_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364686/file_00000000bb248211ae52b82e10503011.png',
    phone: '+255620742182',
    whatsapp: 'https://wa.me/255620742182',
    display_order: 5,
    is_active: true,
    joined_date: '2023-04-01'
  },
  {
    id: 'team-6',
    full_name: 'Upendo Eliud',
    role: 'Studio Operations & Receptionist',
    bio: 'Client experience champion ensuring studio booking schedules, artist hospitality, session log management, and executive front-desk liaison.',
    photo_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362723/Reall_Estate_Profile.jpg',
    display_order: 6,
    is_active: true,
    joined_date: '2023-06-01'
  },
  {
    id: 'team-7',
    full_name: 'Zenaty Baruti',
    stage_name: 'Zinty',
    role: 'Featured Artist & Vocal Stylist',
    bio: 'Sensational vocal force and songwriter under Colls Records whose magnetic timbre and lyrical range deliver uncompromised emotional resonance.',
    photo_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362935/file_00000000a7f88211afb6c4fd65672b92.png',
    display_order: 7,
    is_active: true,
    joined_date: '2023-08-15'
  }
];

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Music Recording',
    slug: 'music-recording',
    description: 'Pristine acoustic recording with industry-grade Neumann and Shure microphones, acoustically tuned vocal isolation booths, and pristine preamps.',
    swahili_name: 'Kurekodi Muziki',
    swahili_description: 'Kurekodi sauti safi kwa vifaa vya kisasa, studio yenye acoustics maalum, na maikrofoni za kiwango cha juu cha kimataifa.',
    icon: 'Mic',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366475/5_Tips_for_a_DIY_Recording_Studio_at_Home_-_Page_2_of_2_-_Zen_of_Zada.jpg',
    starting_price: 50000,
    category: 'audio',
    display_order: 1
  },
  {
    id: 'srv-2',
    name: 'Beats Making & Production',
    slug: 'beats-making',
    description: 'Custom instrumental compositions across Bongo Flava, Afro-Beats, Amapiano, Trap, Singeli, Reggae, and cinematic film scores crafted by our in-house producers.',
    swahili_name: 'Kutengeneza Midundo (Beats)',
    swahili_description: 'Ubunifu wa midundo asilia ya Bongo Flava, Afrobeat, Amapiano, Singeli na mitindo yote ya kisasa kwa ubora wa kipekee.',
    icon: 'Music2',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362238/Cinematic_Producer_Portrait_with_Blue_Locs.png',
    starting_price: 150000,
    category: 'audio',
    display_order: 2
  },
  {
    id: 'srv-3',
    name: 'Audio Mixing',
    slug: 'audio-mixing',
    description: 'Surgical frequency balancing, vocal tuning, compression, dynamic panning, and creative effects routing to ensure every stem sits with supreme clarity.',
    swahili_name: 'Kusawazisha Sauti (Mixing)',
    swahili_description: 'Kupanga kila ala na sauti kwa usahihi wa masafa, madoido ya kipekee na uwiano kamili wa stereo.',
    icon: 'Sliders',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364686/file_00000000bb248211ae52b82e10503011.png',
    starting_price: 100000,
    category: 'audio',
    display_order: 3
  },
  {
    id: 'srv-4',
    name: 'Audio Mastering',
    slug: 'audio-mastering',
    description: 'The final polish delivering commercial loudness (LUFS), stereo widening, punch, and analog warmth calibrated for Spotify, Apple Music, radio, and club playback.',
    swahili_name: 'Mastering ya Muziki',
    swahili_description: 'Ung’arishaji wa mwisho wa wimbo ili uwe na sauti kali, nzito na ya ushindani kwenye redio na majukwaa yote ya kidijitali.',
    icon: 'Disc',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366234/Cinematic_Music_Producer_Portrait.png',
    starting_price: 80000,
    category: 'audio',
    display_order: 4
  },
  {
    id: 'srv-5',
    name: 'Music Promotion & PR',
    slug: 'promotion',
    description: 'High-impact promotional campaigns across Tanzanian radio, TV stations, digital playlists, influencer activations, and targeted social media marketing.',
    swahili_name: 'Kutangaza Muziki (Promotion)',
    swahili_description: 'Mikakati ya kusambaza na kutangaza wimbo wako kwenye redio, runinga, mitandao ya kijamii na majukwaa ya muziki.',
    icon: 'Radio',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362703/Marketing_manager.png',
    starting_price: 200000,
    category: 'creative',
    display_order: 5
  },
  {
    id: 'srv-6',
    name: 'Global Music Distribution',
    slug: 'distribution',
    description: 'Publish your releases worldwide to over 150 digital platforms (Spotify, Apple Music, Boomplay, Audiomack, YouTube Music) with 100% royalty collection.',
    swahili_name: 'Usambazaji wa Muziki Duniani',
    swahili_description: 'Kuweka nyimbo zako kwenye Spotify, Apple Music, Boomplay, na majukwaa zaidi ya 150 duniani kote pamoja na kulipwa mirahaba yako yote.',
    icon: 'Globe',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793365778/file_000000001b348211a217db1b1a5c7635.png',
    starting_price: 70000,
    category: 'creative',
    display_order: 6
  },
  {
    id: 'srv-7',
    name: 'Commercial Adverts & Jingles',
    slug: 'advert',
    description: 'Catchy commercial audio spots, radio jingles, and brand soundscapes tailored for East African enterprises, FMCG brands, and political or social awareness campaigns.',
    swahili_name: 'Matangazo ya Biashara na Jingles',
    swahili_description: 'Utengenezaji wa matangazo ya sauti na video ya biashara, jingles zenye kuvutia, na sauti maalum za utangazaji wa kampuni.',
    icon: 'Megaphone',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793362831/NEW_ERA_2026.jpg',
    starting_price: 250000,
    category: 'creative',
    display_order: 7
  },
  {
    id: 'srv-8',
    name: 'Music Video Production',
    slug: 'video-production',
    description: '4K cinematic music video directing, location scouting along the scenic Tanga coast, dynamic lighting, color grading, and Hollywood-level VFX.',
    swahili_name: 'Utengenezaji wa Video za Muziki',
    swahili_description: 'Upigaji wa video za 4K zenye ubora wa kimataifa, muonekano wa sinema na rangi safi kutoka pwani ya Tanga hadi kwingineko.',
    icon: 'Video',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366305/Official_Zinty_01.png',
    starting_price: 800000,
    category: 'video',
    display_order: 8
  },
  {
    id: 'srv-9',
    name: 'Film & Narrative Production',
    slug: 'film-production',
    description: 'Full-service cinematic storytelling: script development, casting, multi-camera cinematography, sound design, and feature/short film post-production.',
    swahili_name: 'Utengenezaji wa Filamu',
    swahili_description: 'Uandaaji wa filamu za kisasa kuanzia uandishi wa hadithi, picha za sinema, muongozaji hodari na sauti zenye hisia.',
    icon: 'Clapperboard',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364493/Studio_Banner_Wall_Portraits.png',
    starting_price: 1500000,
    category: 'video',
    display_order: 9
  },
  {
    id: 'srv-10',
    name: 'Documentary Production',
    slug: 'documentary',
    description: 'Deep investigative and cultural documentaries capturing human stories, heritage, business profiles, and environmental movements across Tanzania.',
    swahili_name: 'Makala Maalum (Documentary)',
    swahili_description: 'Uzalishaji wa makala za kina za kijamii, kibiashara, kihistoria na kiutamaduni zenye utafiti na ubora wa viwango vya juu.',
    icon: 'Film',
    image_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366475/5_Tips_for_a_DIY_Recording_Studio_at_Home_-_Page_2_of_2_-_Zen_of_Zada.jpg',
    starting_price: 1200000,
    category: 'video',
    display_order: 10
  }
];

export const INITIAL_PRICING: PricingPackage[] = [
  {
    id: 'prc-1',
    category: 'Recording',
    name: 'Hourly Studio Session',
    swahili_name: 'Saa Moja Studio',
    price_tzs: 30000,
    unit: 'per hour',
    features: [
      'Access to Vocal Isolation Booth',
      'Neumann / Shure Pro Microphones',
      'Dedicated Assistant Audio Engineer',
      'Raw stems exported to flash/drive'
    ],
    swahili_features: [
      'Chumba maalum cha kurekodi sauti',
      'Maikrofoni bora za kitaalamu',
      'Mhandisi wa sauti msaidizi',
      'Kupata faili mbichi (raw stems)'
    ],
    is_popular: false,
    display_order: 1,
    is_active: true
  },
  {
    id: 'prc-2',
    category: 'Recording',
    name: 'Full Day Lockout Session',
    swahili_name: 'Studio Siku Nzima',
    price_tzs: 180000,
    unit: 'per 8-hour day',
    features: [
      '8 uninterrupted studio hours',
      'Chief Producer on board',
      'Vocal coaching & arrangement',
      'High-resolution raw multitrack export',
      'Studio refreshments included'
    ],
    swahili_features: [
      'Masaa 8 ya studio bila usumbufu',
      'Chief Producer New Beats studio',
      'Kuelekezwa mpangilio wa sauti',
      'Faili zote za sauti zenye ubora kamili',
      'Vinywaji vya studio'
    ],
    is_popular: true,
    display_order: 2,
    is_active: true
  },
  {
    id: 'prc-3',
    category: 'Beats',
    name: 'Standard Beat Lease',
    swahili_name: 'Kukodisha Mdundo (Standard)',
    price_tzs: 150000,
    unit: 'per track',
    features: [
      'High-quality WAV & MP3 files',
      'Commercial streaming rights (up to 50k streams)',
      '1 radio broadcasting license',
      'Standard licensing agreement'
    ],
    is_popular: false,
    display_order: 3,
    is_active: true
  },
  {
    id: 'prc-4',
    category: 'Beats',
    name: 'Exclusive Custom Beat',
    swahili_name: 'Mdundo wa Kipekee (Exclusive)',
    price_tzs: 400000,
    unit: 'exclusive ownership',
    features: [
      '100% exclusive copyright ownership',
      'Tailored from scratch to artist specifications',
      'Full trackout WAV stems included',
      'Unlimited streams & radio airplay rights'
    ],
    is_popular: true,
    display_order: 4,
    is_active: true
  },
  {
    id: 'prc-5',
    category: 'Mixing',
    name: 'Pro Audio Mixing',
    swahili_name: 'Mixing ya Kisasa',
    price_tzs: 100000,
    unit: 'per track',
    features: [
      'Up to 48 multitrack stems',
      'Vocal pitch correction & autotune tuning',
      'Analog harmonic saturation & stereo imaging',
      'Up to 3 free revisions'
    ],
    is_popular: false,
    display_order: 5,
    is_active: true
  },
  {
    id: 'prc-6',
    category: 'Mastering',
    name: 'Industry Stereo Mastering',
    swahili_name: 'Mastering ya Kiwango cha Kimataifa',
    price_tzs: 80000,
    unit: 'per track',
    features: [
      'Targeted for Spotify / Apple Music (-14 LUFS)',
      'High-resolution 24-bit 48kHz WAV master',
      'Club & Radio EQ optimization',
      'Clean Instrumental and TV track versions'
    ],
    is_popular: false,
    display_order: 6,
    is_active: true
  },
  {
    id: 'prc-7',
    category: 'Full Song',
    name: 'The Hitmaker Complete Package',
    swahili_name: 'Kifurushi Kamili cha Wimbo (Hit Package)',
    price_tzs: 650000,
    unit: 'all-inclusive song',
    features: [
      'Original Custom Beat by New Beats / Jacoh Master',
      'Unlimited recording hours until song is perfect',
      'Professional mixing & stem separation',
      'Commercial 24-bit mastering',
      'Cover art design by Iyan Eman',
      'Global distribution to Spotify & Apple Music'
    ],
    swahili_features: [
      'Mdundo asilia kutoka kwa New Beats au Jacoh',
      'Kurekodi bila kikomo hadi wimbo utoke vizuri',
      'Mixing na Mastering ya viwango vya juu',
      'Kava ya wimbo kutoka kwa Iyan Eman Juma',
      'Kuweka wimbo kwenye masoko yote ya kidijitali'
    ],
    is_popular: true,
    display_order: 7,
    is_active: true
  },
  {
    id: 'prc-8',
    category: 'Promotion',
    name: 'East Africa Digital Blitz',
    swahili_name: 'Kutangaza Wimbo Kidijitali',
    price_tzs: 350000,
    unit: 'per campaign',
    features: [
      'Social media viral visualizer clip (9:16)',
      'Playlist pitching on Boomplay & Spotify',
      'DJ promo pool blast to 100+ East African clubs',
      'TikTok & Instagram Reels challenge curation'
    ],
    is_popular: false,
    display_order: 8,
    is_active: true
  },
  {
    id: 'prc-9',
    category: 'Video & Film',
    name: 'Cinematic 4K Music Video',
    swahili_name: 'Video ya Muziki ya 4K',
    price_tzs: 1200000,
    unit: 'full production',
    features: [
      'Concept treatment & storyboard',
      '2 coastal location shoots (Tanga)',
      'Cinema camera package + drone aerials',
      'Color grading & visual styling',
      'Delivery in 4K YouTube & 1080p broadcast'
    ],
    is_popular: true,
    display_order: 9,
    is_active: true
  }
];

export const INITIAL_TICKER: TickerItem[] = [
  {
    id: 't-1',
    text: "🔥 NEW RELEASE: 'Don Salale' by Iyan Eman ft. Zinty — Stream now on all platforms!",
    swahili_text: "🔥 WIMBO MPYA: 'Don Salale' ya Iyan Eman ft. Zinty — Sikiliza sasa kwenye mifumo yote!",
    link: '/music',
    priority: 'promo',
    is_active: true,
    display_order: 1
  },
  {
    id: 't-2',
    text: "🎙️ STUDIO SPECIAL: Book a 5-hour recording block this month & receive free professional stereo mastering!",
    swahili_text: "🎙️ OFA YA STUDIO: Lipia masaa 5 ya kurekodi mwezi huu upate mastering ya bure!",
    link: '/book',
    priority: 'urgent',
    is_active: true,
    display_order: 2
  },
  {
    id: 't-3',
    text: "🌍 Colls Records signs new talent in Tanga! Connect with Chief Producer New Beats on WhatsApp: +255741808971",
    swahili_text: "🌍 Colls Records inakaribisha wasanii wapya Tanga! Wasiliana na Chief Producer New Beats WhatsApp: +255741808971",
    link: '/team',
    priority: 'normal',
    is_active: true,
    display_order: 3
  },
  {
    id: 't-4',
    text: "🎵 'Msaliti (Official Audio)' produced by Colls Records hits top rotation — Listen in our player!",
    swahili_text: "🎵 'Msaliti (Official Audio)' iliyotengenezwa Colls Records inatikisa — Isikilize kwenye tovuti!",
    link: '/music',
    priority: 'normal',
    is_active: true,
    display_order: 4
  }
];

export const INITIAL_NEWS: NewsPost[] = [
  {
    id: 'news-1',
    title: "Elevating East African Sounds: Colls Records Expands Multi-Studio Facility in Tanga",
    slug: 'colls-records-expands-in-tanga',
    content: "Colls Records has officially upgraded its production suite in Tanga Mjini, featuring state-of-the-art acoustic treatment, vocal isolation booths, and an expanded film editing division led by Iyan Eman Juma. Artists across Tanzania now have access to Grammy-grade production right on the Indian Ocean coast.",
    cover_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364493/Studio_Banner_Wall_Portraits.png',
    author: 'Ashrack Miraji',
    category: 'Studio News',
    published_at: '2026-02-14',
    is_published: true
  },
  {
    id: 'news-2',
    title: "Behind the Beat: Jacoh Master and New Beats Break Down the Sonic Architecture of 'Don Salale'",
    slug: 'behind-the-beat-don-salale',
    content: "In an exclusive workshop, Colls Records producers Jackson Paul (Jacoh Master) and Peter Manyama (New Beats) revealed how traditional coastal rhythms merged with modern 808 subs and intricate vocal harmonies to create the smash release 'Don Salale'.",
    cover_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793366234/Cinematic_Music_Producer_Portrait.png',
    author: 'Iyan Eman',
    category: 'Production Breakdown',
    published_at: '2026-03-01',
    is_published: true
  }
];

export const INITIAL_SITE_CONTENT: SiteContent = {
  hero_headline: "The Pulse of East African Music & Visual Art",
  hero_subheadline: "Colls Records is an international music label, state-of-the-art recording studio and cinematic multimedia production company headquartered in Tanga, Tanzania.",
  hero_banner_url: 'https://res.cloudinary.com/hxdy3cea/image/upload/v1793364493/Studio_Banner_Wall_Portraits.png',
  hero_video_url: 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793366427/Coll_s_Records_animation_02.mp4',
  featured_video_url: 'https://res.cloudinary.com/hxdy3cea/video/upload/v1793366427/Coll_s_Records_animation_02.mp4',
  stats: {
    songs_produced: 480,
    artists_recorded: 190,
    years_experience: 6,
    multimedia_projects: 125
  },
  about: {
    story: "Born in the coastal historic city of Tanga, Tanzania, Colls Records (Colls Company) was established with an uncompromising mission: to create a world-class platform where authentic African sounds and visual stories are engineered with international excellence. From soulful Bongo Flava harmonies to high-octane Afro-Beats and captivating cinema, Colls Records provides artists and corporate clients with the acoustic precision, creative direction, and global distribution needed to captivate audiences worldwide.",
    mission: "To discover, develop, and propel East African musical genius and visual storytelling onto the world stage with unparalleled sonic fidelity and artistic integrity.",
    vision: "To become the undisputed benchmark creative conglomerate in East Africa, bridging grassroots talent with global audiences through cutting-edge technology and cultural authenticity.",
    core_values: [
      "Sonic Perfection — No compromises on acoustic engineering or digital clarity.",
      "Artist Empowerment — Ensuring creators retain creative voice and transparent compensation.",
      "Cultural Authenticity — Rooting modern global genres in Tanzanian rhythmic heritage.",
      "Technological Innovation — Leveraging premier hardware, software, and international digital pipelines."
    ],
    creative_process: [
      { step: "01", title: "Idea & Creative Concept", desc: "Collaborative consultation exploring lyrical themes, vocal range, tempo, and melodic direction." },
      { step: "02", title: "Acoustic Recording", desc: "Capturing pristine vocal performances in tuned acoustic booths using premier condenser mics." },
      { step: "03", title: "Surgical Mixing", desc: "Dynamic balance, tone contouring, frequency cleaning, and spatial soundscape crafting." },
      { step: "04", title: "Stereo Mastering", desc: "Commercial loudness, punch, and analog warmth calibrated for international streaming platforms." },
      { step: "05", title: "Release & Visuals", desc: "Cinematic visualizer or video production, album art direction, and YouTube premiere." },
      { step: "06", title: "Global Promotion", desc: "Direct distribution to 150+ platforms, radio outreach, and East African club and influencer campaigns." }
    ]
  },
  contact: {
    email: 'collsrecords.inc@gmail.com',
    location: 'Tanga Mjini, Tanzania',
    address: 'Colls Records Creative Studios, Tanga Mjini, Tanga, Tanzania',
    youtube: 'https://www.youtube.com/@CollsRecords',
    producer_1: {
      name: 'Peter Manyama (New Beats)',
      phone: '+255741808971',
      whatsapp: 'https://wa.me/255741808971'
    },
    producer_2: {
      name: 'Jackson Paul (Jacoh Master)',
      phone: '+255620742182',
      whatsapp: 'https://wa.me/255620742182'
    }
  }
};
