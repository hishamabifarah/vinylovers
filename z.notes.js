// "use client"

// import Image from "next/image";
// import image1 from "@/assets/song-1.png";
// import image2 from "@/assets/song-2.png";
// import image3 from "@/assets/song-3.png";
// import image4 from "@/assets/song-4.png";
// import trend from "@/assets/trend.png";
// import vinylimg from '@/assets/vinyl.jpg'
// import { Heart } from "lucide-react";
// import Sidebar from "@/components/navigation/Sidebar";

// export default function Page() {
//   return (
//     <div className="container grid w-full grid-cols-[1fr_4fr_2fr] bg-gradient-to-r from-[#050405] to-[#18181d]">
       
//        <Sidebar  />
//       <main className="px-9 py-5">
//         <header className="flex items-center justify-between">
//           <div className="nav-links flex items-center gap-5">
//             <button className="menu-btn" id="menu-open">
//               <i className="bx bx-menu"></i>
//             </button>
//             <a href="#">Music</a>
//             <a href="#">Live</a>
//             <a href="#">Podcast</a>
//           </div>

//           <div className="search">
//             <i className="bx bx-search"></i>
//             <input type="text" placeholder="Type here to search" />
//           </div>
//         </header>

//         <div className="trending mt-10 flex items-center justify-between text-white">
//           <div className="left">
//             <h5 className="font-[bold]">Trending New Song</h5>
//             <div className="info mt-3 p-[26px]">
//               <h2 className="mt-1 p-[10px] text-4xl">Lost Emotions</h2>
//               <h5 className="mt-2 p-[10px] text-1xl text-[#919191]">63 Million Plays</h5>
//               <div className="buttons flex items-center gap-4 mt-[30px]">
//                 <button className="bg-primary text-white font-[bold] cursor-pointer px-4 py-3 rounded-[14px] border-[none]">Listen Now</button>
//                 <Heart className="size-12 bg-primary text-xl p-2.5 rounded-[50%] border-2 border-solid border-black" />
//               </div>
//             </div>
//           </div>
//           <Image className="h-[100%] w-[45%] object-cover object-top rounded-lg" src={vinylimg} alt="" />
//         </div>

//         <div className="playlist mt-3.5 flex gap-5">
//           <div className="music-list w-full rounded-md bg-[#202026] p-5 text-white">
//             <div className="header flex items-center justify-between mb-[30px]">
//               <h5>Top Songs</h5>
//               <a href="#">See all</a>
//             </div>

//             <div className="items">
//               <div className="item flex items-center justify-between mb-5">
//                 <div className="info flex items-center gap-5">
//                   <Image className="h-[50px] w-[50px] object-cover object-top rounded-lg" src={image1} alt="" />
//                   <div className="details">
//                     <h5>Sunrise</h5>
//                     <p>Lila Rivera</p>
//                   </div>
//                 </div>
//                 <div className="actions flex items-center gap-1">
//                   <p className="text-[13px] font-[bold]">03:45</p>
//                   <div className="icon">
//                     <i className="bx bxs-right-arrow"></i>
//                   </div>
//                   <i className="bx bxs-plus-square"></i>
//                 </div>
//               </div>
//               <div className="item flex items-center justify-between mb-5">
//                 <div className="info flex items-center gap-5">
//                   <Image className="h-[50px] w-[50px] object-cover object-top rounded-lg" src={image2} alt="" />
//                   <div className="details">
//                     <h5>Voyage</h5>
//                     <p>Tyde br/ennnan</p>
//                   </div>
//                 </div>
//                 <div className="actions flex items-center gap-1">
//                   <p className="text-[13px] font-[bold]">04:35</p>
//                   <div className="icon">
//                     <i className="bx bxs-right-arrow"></i>
//                   </div>
//                   <i className="bx bxs-plus-square"></i>
//                 </div>
//               </div>
//               <div className="item flex items-center justify-between mb-5">
//                 <div className="info flex items-center gap-5">
//                   <Image className="h-[50px] w-[50px] object-cover object-top rounded-lg" src={image3} alt="" />
//                   <div className="details">
//                     <h5>br/eeze</h5>
//                     <p>Sola Kim</p>
//                   </div>
//                 </div>
//                 <div className="actions flex items-center gap-1">
//                   <p className="text-[13px] font-[bold]">04:22</p>
//                   <div className="icon">
//                     <i className="bx bxs-right-arrow"></i>
//                   </div>
//                   <i className="bx bxs-plus-square"></i>
//                 </div>
//               </div>
//               <div className="item flex items-center justify-between mb-5">
//                 <div className="info flex items-center gap-5">
//                   <Image className="h-[50px] w-[50px] object-cover object-top rounded-lg" src={image4} alt="" />
//                   <div className="details">
//                     <h5>Twilight</h5>
//                     <p>Jett Lawsonn</p>
//                   </div>
//                 </div>
//                 <div className="actions flex items-center gap-1">
//                   <p className="text-[13px] font-[bold]">03:17</p>
//                   <div className="icon">
//                     <i className="bx bxs-right-arrow"></i>
//                   </div>
//                   <i className="bx bxs-plus-square"></i>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <div className="right-section hidden md:block">
//         <div className="profile">
//           <i className="bx bxs-bell"></i>
//           <i className="bx bxs-cog"></i>
//           <div className="user">
//             <div className="left">{/* <img src="assets/profile.png"> */}</div>
//             <div className="right">
//               <h5>Jhon Doe</h5>
//             </div>
//           </div>
//         </div>

//         <div className="music-player">
//           <div className="top-section">
//             <div className="header">
//               <h5>Player</h5>
//               <i className="bx bxs-playlist"></i>
//             </div>
//             <div className="song-info">
//               {/* <img src="assets/player.png"> */}
//               <div className="description">
//                 <h3>Ripple Echoes</h3>
//                 <h5>Kael Fischer</h5>
//                 <p>Best of 2024</p>
//               </div>
//               <div className="progress">
//                 <p>02:45</p>
//                 <div className="active-line"></div>
//                 <div className="deactive-line"></div>
//                 <p>01:02</p>
//               </div>
//             </div>
//           </div>

//           <div className="player-actions">
//             <div className="buttons">
//               <i className="bx bx-repeat"></i>
//               <i className="bx bx-first-page"></i>
//               <i className="bx bxs-right-arrow play-button"></i>
//               <i className="bx bx-last-page"></i>
//               <i className="bx bx-transfer-alt"></i>
//             </div>
//             <div className="lyrics">
//               <i className="bx bx-chevron-up"></i>
//               <h5>LYRICS</h5>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// -------------------------------------------------------------------


// "use client"

// import Image from "next/image";
// import image1 from "@/assets/song-1.png";
// import image2 from "@/assets/song-2.png";
// import image3 from "@/assets/song-3.png";
// import image4 from "@/assets/song-4.png";
// import trend from "@/assets/trend.png";
// import vinylimg from '@/assets/vinyl.jpg'
// import { Heart } from "lucide-react";
// import Sidebar from "@/components/navigation/Sidebar";

// export default function Page() {
//   return (
//     <div className="container grid w-full grid-cols-[1fr_4fr_2fr] bg-gradient-to-r from-[#050405] to-[#18181d]">
       
//        <Sidebar  />
//       <main className="px-9 py-5">
//         <header className="flex items-center justify-between">
//           <div className="nav-links flex items-center gap-5">
//             <button className="menu-btn" id="menu-open">
//               <i className="bx bx-menu"></i>
//             </button>
//             <a href="#">Music</a>
//             <a href="#">Live</a>
//             <a href="#">Podcast</a>
//           </div>

//           <div className="search">
//             <i className="bx bx-search"></i>
//             <input type="text" placeholder="Type here to search" />
//           </div>
//         </header>

//         <div className="trending mt-10 flex items-center justify-between text-white">
//           <div className="left">
//             <h5 className="font-[bold]">Trending New Song</h5>
//             <div className="info mt-3 p-[26px]">
//               <h2 className="mt-1 p-[10px] text-4xl">Lost Emotions</h2>
//               <h5 className="mt-2 p-[10px] text-1xl text-[#919191]">63 Million Plays</h5>
//               <div className="buttons flex items-center gap-4 mt-[30px]">
//                 <button className="bg-primary text-white font-[bold] cursor-pointer px-4 py-3 rounded-[14px] border-[none]">Listen Now</button>
//                 <Heart className="size-12 bg-primary text-xl p-2.5 rounded-[50%] border-2 border-solid border-black" />
//               </div>
//             </div>
//           </div>
//           <Image className="h-[100%] w-[45%] object-cover object-top rounded-lg" src={vinylimg} alt="" />
//         </div>

//         <div className="playlist mt-3.5 flex gap-5">
//           <div className="music-list w-full rounded-md bg-[#202026] p-5 text-white">
//             <div className="header flex items-center justify-between mb-[30px]">
//               <h5>Top Songs</h5>
//               <a href="#">See all</a>
//             </div>

//             <div className="items">
//               <div className="item flex items-center justify-between mb-5">
//                 <div className="info flex items-center gap-5">
//                   <Image className="h-[50px] w-[50px] object-cover object-top rounded-lg" src={image1} alt="" />
//                   <div className="details">
//                     <h5>Sunrise</h5>
//                     <p>Lila Rivera</p>
//                   </div>
//                 </div>
//                 <div className="actions flex items-center gap-1">
//                   <p className="text-[13px] font-[bold]">03:45</p>
//                   <div className="icon">
//                     <i className="bx bxs-right-arrow"></i>
//                   </div>
//                   <i className="bx bxs-plus-square"></i>
//                 </div>
//               </div>
//               <div className="item flex items-center justify-between mb-5">
//                 <div className="info flex items-center gap-5">
//                   <Image className="h-[50px] w-[50px] object-cover object-top rounded-lg" src={image2} alt="" />
//                   <div className="details">
//                     <h5>Voyage</h5>
//                     <p>Tyde br/ennnan</p>
//                   </div>
//                 </div>
//                 <div className="actions flex items-center gap-1">
//                   <p className="text-[13px] font-[bold]">04:35</p>
//                   <div className="icon">
//                     <i className="bx bxs-right-arrow"></i>
//                   </div>
//                   <i className="bx bxs-plus-square"></i>
//                 </div>
//               </div>
//               <div className="item flex items-center justify-between mb-5">
//                 <div className="info flex items-center gap-5">
//                   <Image className="h-[50px] w-[50px] object-cover object-top rounded-lg" src={image3} alt="" />
//                   <div className="details">
//                     <h5>br/eeze</h5>
//                     <p>Sola Kim</p>
//                   </div>
//                 </div>
//                 <div className="actions flex items-center gap-1">
//                   <p className="text-[13px] font-[bold]">04:22</p>
//                   <div className="icon">
//                     <i className="bx bxs-right-arrow"></i>
//                   </div>
//                   <i className="bx bxs-plus-square"></i>
//                 </div>
//               </div>
//               <div className="item flex items-center justify-between mb-5">
//                 <div className="info flex items-center gap-5">
//                   <Image className="h-[50px] w-[50px] object-cover object-top rounded-lg" src={image4} alt="" />
//                   <div className="details">
//                     <h5>Twilight</h5>
//                     <p>Jett Lawsonn</p>
//                   </div>
//                 </div>
//                 <div className="actions flex items-center gap-1">
//                   <p className="text-[13px] font-[bold]">03:17</p>
//                   <div className="icon">
//                     <i className="bx bxs-right-arrow"></i>
//                   </div>
//                   <i className="bx bxs-plus-square"></i>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <div className="right-section hidden md:block">
//         <div className="profile">
//           <i className="bx bxs-bell"></i>
//           <i className="bx bxs-cog"></i>
//           <div className="user">
//             <div className="left">{/* <img src="assets/profile.png"> */}</div>
//             <div className="right">
//               <h5>Jhon Doe</h5>
//             </div>
//           </div>
//         </div>

//         <div className="music-player">
//           <div className="top-section">
//             <div className="header">
//               <h5>Player</h5>
//               <i className="bx bxs-playlist"></i>
//             </div>
//             <div className="song-info">
//               {/* <img src="assets/player.png"> */}
//               <div className="description">
//                 <h3>Ripple Echoes</h3>
//                 <h5>Kael Fischer</h5>
//                 <p>Best of 2024</p>
//               </div>
//               <div className="progress">
//                 <p>02:45</p>
//                 <div className="active-line"></div>
//                 <div className="deactive-line"></div>
//                 <p>01:02</p>
//               </div>
//             </div>
//           </div>

//           <div className="player-actions">
//             <div className="buttons">
//               <i className="bx bx-repeat"></i>
//               <i className="bx bx-first-page"></i>
//               <i className="bx bxs-right-arrow play-button"></i>
//               <i className="bx bx-last-page"></i>
//               <i className="bx bx-transfer-alt"></i>
//             </div>
//             <div className="lyrics">
//               <i className="bx bx-chevron-up"></i>
//               <h5>LYRICS</h5>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
