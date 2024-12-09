'use client'

import * as z from 'zod'
import axios from 'axios'

import { useStoreModal } from "@/hooks/use-store-modal"
import Modal from "../ui/modal"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';
import toast from 'react-hot-toast'

const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
    const [loading, setLoading] = useState(false)

    const storeModal = useStoreModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (value: z.infer<typeof formSchema>) => {
        try {
            setLoading(true)
            const response = await axios.post('/api/stores', value);
            toast.success("Successfully Created Store");
            window.location.assign(`/${response.data.id}`)
        } catch (error) {
            toast.error("Failed to Create Store");
        } finally {
            setLoading(false)
        }        
    };

    return (
        <Modal  
            title="Create Store" 
            description="Add a new store for creating product and category" 
            isOpen={storeModal.isOpen} 
            onClose={storeModal.onClose}
        >
            <div className='space-y-4 py-2 pb-4'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField 
                            control={form.control} 
                            name="name" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                        placeholder='Your Store Name' {...field}
                                        disabled={loading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                             )} 
                        />
                        <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                            <Button
                            disabled={loading}
                            variant={"outline"}
                            onClick={storeModal.onClose}
                            >Cancel</Button>
                            <Button type="submit" disabled={loading}>Continue</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </Modal>
    )
}