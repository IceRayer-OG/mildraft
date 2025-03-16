// import Image from "next/image";
import { Avatar, AvatarImage,AvatarFallback } from "~/_components/ui/avatar";
import { Posts } from "~/_components/posts";

export default async function LeaguePage() {
  return (
    <div className="min-h-screen w-full p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="flex justify-between gap-4">
        <div className="flex">Logo</div>
        <div>
          <h1>Welcome to SvBaseball!</h1>
        </div>
        <div className="content-right">
          <Avatar >
            <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
            <AvatarFallback className="text-black">SV</AvatarFallback>
          </Avatar> 
        </div>
      </div>
      <div>
        <div className="flex flex-col gap-4">
          <p>This is your home page. </p>
          <Posts />
        </div>
      </div>
    </div>
  );
}