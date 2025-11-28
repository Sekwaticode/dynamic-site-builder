// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-soft">
      <div className="text-center max-w-2xl px-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-medical rounded-2xl mb-6 shadow-strong">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h1 className="mb-4 text-5xl font-bold text-foreground">Harva Group CMS</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Professional content management system for your health & wellness website
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/auth">
            <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity shadow-soft">
              Sign In to Dashboard
            </button>
          </a>
          <a href="/dashboard">
            <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-accent transition-colors shadow-soft">
              View Dashboard
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Index;
