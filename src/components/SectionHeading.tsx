interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
}

export function SectionHeading({ title, subtitle, alignment = 'left' }: SectionHeadingProps) {
  const align = alignment === 'center' ? 'text-center' : 'text-left';

  return (
    <div className={`mb-10 ${align}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-lg md:text-xl text-navy-500 max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-1 w-16 rounded-full bg-accent-500 ${alignment === 'center' ? 'mx-auto' : ''}`} />
    </div>
  );
}
