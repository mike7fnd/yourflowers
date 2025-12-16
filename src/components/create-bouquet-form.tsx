'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Flower } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { addBouquet } from '@/lib/db';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  recipientName: z.string().optional(),
  message: z.string().min(1, { message: 'A message is required.' }).max(280),
  deliveryType: z.enum(['private', 'public', 'timed'], {
    required_error: 'Please select a delivery type.',
  }),
  deliveryDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateBouquetForm({ flower }: { flower: Flower }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: '',
      message: '',
      deliveryType: 'private',
    },
  });

  const deliveryType = form.watch('deliveryType');

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      const newBouquet = addBouquet({ ...values, flower });
      
      toast({
        title: 'Flower Sent!',
        description: 'Your beautiful gesture has been created.',
      });
      
      // Redirect to the newly created flower's page.
      // Add a query param to show a success message.
      router.push(`/flower/${newBouquet.id}?from=create`);

    } catch (error) {
      console.error('Failed to create bouquet:', error);
      toast({
        variant: 'destructive',
        title: 'Oh no!',
        description: 'Something went wrong while sending your flower.',
      });
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="recipientName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>To (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Dedicate to someone..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A quiet word, a shared memory, a simple hope..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
               <FormDescription>
                Short and emotionally resonant.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryType"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Delivery Type</FormLabel>
              <FormControl>
                <Tabs
                  defaultValue={field.value}
                  onValueChange={(value) => {
                     if (value === 'private' || value === 'public' || value === 'timed') {
                        field.onChange(value);
                     }
                  }}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="private">Private</TabsTrigger>
                    <TabsTrigger value="public">Public</TabsTrigger>
                    <TabsTrigger value="timed">Timed</TabsTrigger>
                  </TabsList>
                </Tabs>
              </FormControl>
              <FormDescription>
                {
                  {
                    private: 'Private flowers can be shared with a unique link.',
                    public: 'Public flowers will appear in the garden for everyone to see.',
                    timed: 'Timed flowers will be delivered on a future date.',
                  }[field.value]
                }
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {deliveryType === 'timed' && (
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Delivery Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>The flower will become visible on this date.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Send Flower
        </Button>
      </form>
    </Form>
  );
}
