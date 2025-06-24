"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon, XCircle, XCircleIcon } from "lucide-react"
import { NewMeetingDialog } from "./new-meeting-dialog"
import React from "react"

export const MeetingsListHeader = () => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

     return (
        <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}/>
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-14">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Meetings</h5>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusIcon/>
                    New Meeting
                </Button>
            </div>
            <div className="flex items-center gap-x-2 p-1">
                TODO: Filters
            </div>
        </div>
        </>
     )
}