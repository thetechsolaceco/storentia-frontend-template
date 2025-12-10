import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Fashion Enthusiast",
    content:
      "StoreKit has completely transformed how I shop online. The quality is unmatched!",
    avatar: "AJ",
  },
  {
    name: "Sarah Smith",
    role: "Tech Reviewer",
    content:
      "Fast shipping and excellent customer service. Highly recommended for electronics.",
    avatar: "SS",
  },
  {
    name: "Mike Brown",
    role: "Verified Buyer",
    content:
      "I love the curated selection. It's so easy to find unique items here.",
    avatar: "MB",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
          What Our Customers Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="bg-background border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-12 w-12 mb-4">
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <h4 className="font-semibold">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
