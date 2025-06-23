import {JSX, useState} from 'react';
import {Button} from '@/components/ui/button';
import { ResponsiveDialog } from '@/components/responsive-dialog';

export const useConfirm = (
    title: string,
    description: string
) => {
    const [isOpen, setIsOpen] = useState(false);
    const [resolve, setResolve] = useState<() => void>(() => () => {});

    const confirm = (onConfirm: () => void) => {
        return new Promise<void>((res) => {
            setResolve(() => () => {
                onConfirm();
                res();
            });
            setIsOpen(true);
        });
    };

    const dialog = (
        <ResponsiveDialog
            open={isOpen}
            onOpenChange={setIsOpen}
            title={title}
            description={description}
        >
            <div className="pt-4 w-full flex flex-col-reverse gap-y-2 lg:flex-row gap-x-2 items-center justify-end">
                <Button variant="secondary" onClick={() => setIsOpen(false)}>
                    Cancel
                </Button>
                <Button variant="default" onClick={() => {
                    resolve();
                    setIsOpen(false);
                }}>
                    Confirm
                </Button>
            </div>
        </ResponsiveDialog>
    );

    return { confirm, dialog };
}