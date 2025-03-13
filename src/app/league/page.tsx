import Image from "next/image";
import { Avatar, AvatarImage,AvatarFallback } from "~/_components/ui/avatar";
import { Posts } from "~/_components/posts";

export default async function LeaguePage() {
  return (
    <div className="min-h-screen w-full p-4 bg-gradient-to-b from-[#12026d] to-[#15162c] text-white">
      <div className="grid grid-cols-3 grid-rows-3 gap-4 justify-evenly border">
        <div className="flex">Logo</div>
        <div>
          <h2>Welcome to SvBaseball!</h2>
        </div>
        <div className="content-right">
          <Avatar >
            <AvatarImage src="/_assets/avatar.png" alt="Avatar" />
            <AvatarFallback>username</AvatarFallback>
          </Avatar> 
        </div>
        <div className="col-span-3 items-center">
          <p>This is your home page. </p>
          <Posts />
        </div>
      </div>
    </div>
  );
}