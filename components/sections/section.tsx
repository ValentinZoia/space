


function Section({ title, children }: { title: string; children: React.ReactNode }) {


  return (
    <section id={title} className="py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">
          {title}
        </h2>
        {children}

      </div>

    </section>
  );
}

export default Section;
