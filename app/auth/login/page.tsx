import LogInForm from './LogInForm';

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">Sign In</h1>
        <LogInForm />
      </div>
    </div>
  );
}
