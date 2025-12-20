'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Bouquet, Flower } from '@/lib/types';
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
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { containsProfanity } from '@/lib/profanity';
import { addBouquet } from '@/lib/db';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { PrivateFlowerModal } from './private-flower-modal';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  recipientName: z.string().optional(),
  message: z.string().min(1, { message: 'A message is required.' })
    .refine(value => !containsProfanity(value), {
      message: 'Your message contains inappropriate language. Please revise it.',
    }),
  deliveryType: z.enum(['public', 'private'], {
    required_error: 'Please select a delivery type.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateBouquetForm({ flower }: { flower: Flower }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivateModal, setShowPrivateModal] = useState(false);
  const [createdBouquet, setCreatedBouquet] = useState<Bouquet | null>(null);
  
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientName: '',
      message: '',
      deliveryType: 'public',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      if (!user && auth) {
        initiateAnonymousSignIn(auth);
        toast({
          title: "Just a moment...",
          description: "We're getting things ready. Please try sending your flower again.",
        });
        setIsSubmitting(false);
        return;
      }
      
      if (!firestore) {
          throw new Error("Firestore is not available.");
      }

      const bouquetId = await addBouquet(firestore, {
        flower,
        ...values,
      });
      
      if (values.deliveryType === 'public') {
        toast({
          title: 'Flower Sent!',
          description: 'Your flower has been added to the public garden.',
        });
        router.push('/garden');
      } else {
        setCreatedBouquet({
            id: bouquetId,
            flower,
            createdAt: new Date(),
            ...values
        });
        setShowPrivateModal(true);
      }
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.message || "Could not send the flower. Please try again.",
        });
        console.error("Form submission failed:", error);
    } finally {
        setIsSubmitting(false);
    }
  }

  const placeholder = PlaceHolderImages.find((p) => p.id === flower.image);
  
  const isButtonDisabled = isSubmitting || isUserLoading;

  return (
    <>
      <PrivateFlowerModal
        isOpen={showPrivateModal}
        onClose={() => setShowPrivateModal(false)}
        bouquet={createdBouquet}
        imageUrl={placeholder?.imageUrl}
      />
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
                  Your kind words will be shared.
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
                       if (value === 'public' || value === 'private') {
                          field.onChange(value);
                       }
                    }}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="public">Public</TabsTrigger>
                      <TabsTrigger value="private">Private</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </FormControl>
                <FormDescription>
                  {
                    {
                      public: 'Public flowers will appear in the garden for everyone to see.',
                      private: 'Private flowers can be shared with a unique link.',
                    }[field.value]
                  }
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isButtonDisabled} className="w-full">
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isUserLoading && !isSubmitting ? 'Connecting...' : 'Send Flower'}
          </Button>
        </form>
      </Form>
    </>
  );
}
