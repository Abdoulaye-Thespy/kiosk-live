import { prisma } from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"
import { getAllProspects } from "@/app/actions/prospectactions"

export async function GET() {
  try {
    const result = await getAllProspects()

    if (result.success) {
      return NextResponse.json(result.prospects)
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error fetching prospects:", error)
    return NextResponse.json({ error: "Failed to fetch prospects" }, { status: 500 })
  }
}

// Update the POST handler to use the createdById from the request
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    const prospect = await prisma.prospect.create({
      data: {
        id: data.id, // Use the ID from the request if provided
        name: data.name,
        contact: data.contact,
        need: data.need,
        prospectStatus: data.prospectStatus || "NEW",
        source: data.source,
        assignedToId: data.assignedToId || null,
        estimatedValue: data.estimatedValue ? Number.parseFloat(data.estimatedValue) : null,
        notes: data.notes,
        lastContactDate: new Date(),
        createdById: data.createdById, // Use the createdById from the request
      },
    })

    return NextResponse.json(prospect, { status: 201 })
  } catch (error) {
    console.error("Error creating prospect:", error)
    return NextResponse.json({ error: "Failed to create prospect" }, { status: 500 })
  }
}

