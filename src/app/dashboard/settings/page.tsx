import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-display mb-8">Settings</h1>

      <div className="max-w-2xl">
        <div className="bg-secondary/10 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-muted-foreground mb-6">
            Manage your account settings and preferences.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                className="w-full border rounded-md p-2"
                placeholder="Your name"
                disabled
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full border rounded-md p-2"
                placeholder="your.email@example.com"
                disabled
              />
            </div>
          </div>

          <div className="mt-6">
            <Button disabled>Save Changes</Button>
          </div>
        </div>

        <div className="bg-secondary/10 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Appearance</h2>
          <p className="text-muted-foreground mb-6">
            Customize how DeepTalk looks for you.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Theme</label>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" disabled>
                  Light
                </Button>
                <Button variant="outline" className="flex-1" disabled>
                  Dark
                </Button>
                <Button variant="outline" className="flex-1" disabled>
                  System
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-destructive/10 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-destructive">
            Danger Zone
          </h2>
          <p className="text-muted-foreground mb-6">
            Irreversible and destructive actions.
          </p>

          <Button variant="destructive" disabled>
            Delete Account
          </Button>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>DeepTalk Cards v0.1.0</p>
        <p>Settings functionality coming soon.</p>
      </div>
    </div>
  );
}
