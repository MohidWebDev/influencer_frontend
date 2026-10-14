// Home page ke testimonials (asal logon ki asal baatein). Jab tak ye list khali hai,
// home page pe testimonials ka hissa dikhta hi nahi.
//
// Naya testimonial daalne ke liye ek object add karein, jaise:
//   {
//     name: 'Ayesha Khan',
//     role: 'Marketing Lead',
//     company: 'Acme Foods',
//     quote: 'We found three food creators for our Ramadan campaign in one afternoon.',
//     photoUrl: 'https://...', // optional: na ho to naam ke pehle huroof
//   },
// Quote jis zaban mein likha jaye usi mein dikhta hai (har zaban mein ek hi).
export interface Testimonial {
  name: string
  role?: string
  company?: string
  quote: string
  photoUrl?: string
}

export const TESTIMONIALS: Testimonial[] = []
