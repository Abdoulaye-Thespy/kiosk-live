import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "../[...nextauth]/route"

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 })
  }

  return NextResponse.json(session)
}

