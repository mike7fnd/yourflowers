export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-headline tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            About yourflowers
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            A quiet place to send and receive digital flowers.
          </p>
        </div>
        <div className="prose prose-lg mx-auto text-foreground/80">
          <p>
            In a world of constant noise and fleeting digital interactions,
            yourflowers offers a space for quiet connection. It’s a place to
            send a simple, beautiful gesture to someone you care about, without
            the pressure of crafting the perfect message.
          </p>
          <p>
            Each flower carries its own traditional meaning, allowing you to
            express a sentiment—love, sympathy, gratitude, or hope—through a
            simple, elegant offering. You can add a short personal note, or
            let the flower speak for itself.
          </p>
          <p>
            Whether you send a flower privately to one person, or contribute it
            to the public garden for all to see, you are participating in a
            shared moment of stillness and contemplation.
          </p>
          <p>
            This is a space for thoughtfulness, for quiet moments, and for the
            simple beauty of a flower.
          </p>
        </div>
      </div>
    </div>
  );
}
