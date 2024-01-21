import { getServerAuthSession } from "@/server/auth";
import Link from "next/link";
import React, { Fragment } from "react";
import PostPage from "./PostPage";

const Posts = async () => {
  const session = await getServerAuthSession();

  return (
    <Fragment>
      {!session?.user ? (
        <div className="mx-auto mt-10 space-x-3">
          Please Auth First{" "}
          <Link
            href={"/api/auth/signin"}
            className="rounded-md bg-blue-700 p-3 text-white"
          >
            Login
          </Link>
        </div>
      ) : (
        <>
          <PostPage userId={session.user.id} />
        </>
      )}
    </Fragment>
  );
};

export default Posts;
