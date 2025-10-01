import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BookOpen } from "lucide-react";

const Reference = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <span className="font-semibold">Reference Guide</span>
          </div>
          <div className="w-32" />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Complete Reference Guide</h1>
          <p className="text-lg text-muted-foreground">
            Quick reference for all gerund and infinitive patterns
          </p>
        </div>

        <Tabs defaultValue="gerunds" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="gerunds">Gerunds</TabsTrigger>
            <TabsTrigger value="infinitives">Infinitives</TabsTrigger>
            <TabsTrigger value="both">Both Forms</TabsTrigger>
          </TabsList>

          <TabsContent value="gerunds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verbs Followed by Gerunds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Common Verbs:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>admit</strong> - He admitted stealing the money</li>
                      <li>• <strong>avoid</strong> - I avoid eating fast food</li>
                      <li>• <strong>consider</strong> - She's considering moving abroad</li>
                      <li>• <strong>deny</strong> - They denied breaking the window</li>
                      <li>• <strong>enjoy</strong> - We enjoy swimming</li>
                      <li>• <strong>finish</strong> - I finished writing the report</li>
                      <li>• <strong>keep</strong> - He keeps asking questions</li>
                      <li>• <strong>mind</strong> - Do you mind closing the door?</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">More Verbs:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>miss</strong> - I miss living by the beach</li>
                      <li>• <strong>postpone</strong> - We postponed making the decision</li>
                      <li>• <strong>practice</strong> - She practices playing piano daily</li>
                      <li>• <strong>recommend</strong> - I recommend visiting Paris</li>
                      <li>• <strong>suggest</strong> - He suggested going to the park</li>
                      <li>• <strong>understand</strong> - I understand wanting privacy</li>
                      <li>• <strong>can't stand</strong> - I can't stand waiting</li>
                      <li>• <strong>feel like</strong> - I feel like going out</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preposition + Gerund</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>After prepositions, always use gerunds:</strong></p>
                  <p>• I'm interested <strong>in learning</strong> Spanish</p>
                  <p>• She's good <strong>at playing</strong> tennis</p>
                  <p>• He's tired <strong>of working</strong> late</p>
                  <p>• They're excited <strong>about traveling</strong></p>
                  <p>• I apologized <strong>for being</strong> late</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Go + Gerund Expressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <ul className="space-y-1">
                    <li>• go <strong>shopping</strong></li>
                    <li>• go <strong>swimming</strong></li>
                    <li>• go <strong>fishing</strong></li>
                    <li>• go <strong>skiing</strong></li>
                  </ul>
                  <ul className="space-y-1">
                    <li>• go <strong>running</strong></li>
                    <li>• go <strong>hiking</strong></li>
                    <li>• go <strong>dancing</strong></li>
                    <li>• go <strong>camping</strong></li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="infinitives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verbs Followed by Infinitives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold">Common Verbs:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>agree</strong> - They agreed to help</li>
                      <li>• <strong>decide</strong> - I decided to leave</li>
                      <li>• <strong>expect</strong> - We expect to arrive soon</li>
                      <li>• <strong>hope</strong> - She hopes to see you</li>
                      <li>• <strong>plan</strong> - We plan to visit Paris</li>
                      <li>• <strong>promise</strong> - He promised to be on time</li>
                      <li>• <strong>refuse</strong> - They refused to work late</li>
                      <li>• <strong>want</strong> - I want to learn French</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold">More Verbs:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• <strong>wish</strong> - I wish to speak with you</li>
                      <li>• <strong>offer</strong> - She offered to help</li>
                      <li>• <strong>manage</strong> - I managed to finish on time</li>
                      <li>• <strong>learn</strong> - He learned to drive</li>
                      <li>• <strong>fail</strong> - They failed to arrive on time</li>
                      <li>• <strong>afford</strong> - I can't afford to buy it</li>
                      <li>• <strong>deserve</strong> - You deserve to win</li>
                      <li>• <strong>tend</strong> - She tends to worry</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Be + Adjective + Infinitive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                  <p><strong>Common patterns:</strong></p>
                  <p>• It's easy <strong>to understand</strong></p>
                  <p>• It's difficult <strong>to learn</strong></p>
                  <p>• It's important <strong>to study</strong></p>
                  <p>• It's nice <strong>to meet</strong> you</p>
                  <p>• It's dangerous <strong>to drive</strong> fast</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verb + Object + Infinitive</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground mb-2">Some verbs are followed by an object + infinitive:</p>
                  <p>• I <strong>want you to come</strong></p>
                  <p>• She <strong>asked me to help</strong></p>
                  <p>• They <strong>told us to wait</strong></p>
                  <p>• He <strong>invited them to stay</strong></p>
                  <p>• We <strong>expected her to call</strong></p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="both" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verbs with Same Meaning (Both Forms)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-accent/10 border border-accent/20 p-4 rounded-lg">
                    <p className="font-semibold mb-2">These verbs can use both forms with no change in meaning:</p>
                    <ul className="text-sm space-y-2 text-muted-foreground">
                      <li>• <strong>begin:</strong> It began raining / It began to rain</li>
                      <li>• <strong>start:</strong> She started crying / She started to cry</li>
                      <li>• <strong>continue:</strong> We continued working / We continued to work</li>
                      <li>• <strong>like:</strong> I like reading / I like to read</li>
                      <li>• <strong>love:</strong> He loves swimming / He loves to swim</li>
                      <li>• <strong>hate:</strong> They hate waiting / They hate to wait</li>
                      <li>• <strong>prefer:</strong> I prefer walking / I prefer to walk</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verbs with Different Meanings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-primary pl-4 space-y-2">
                  <h4 className="font-semibold">remember</h4>
                  <p className="text-sm">• <strong>+ gerund</strong> = recall a past event</p>
                  <p className="text-sm text-muted-foreground ml-4">I remember meeting you (I have a memory of it)</p>
                  <p className="text-sm">• <strong>+ infinitive</strong> = don't forget</p>
                  <p className="text-sm text-muted-foreground ml-4">Remember to call me (Don't forget!)</p>
                </div>

                <div className="border-l-4 border-secondary pl-4 space-y-2">
                  <h4 className="font-semibold">forget</h4>
                  <p className="text-sm">• <strong>+ gerund</strong> = can't forget past experience</p>
                  <p className="text-sm text-muted-foreground ml-4">I'll never forget seeing Paris</p>
                  <p className="text-sm">• <strong>+ infinitive</strong> = fail to do something</p>
                  <p className="text-sm text-muted-foreground ml-4">I forgot to lock the door</p>
                </div>

                <div className="border-l-4 border-accent pl-4 space-y-2">
                  <h4 className="font-semibold">stop</h4>
                  <p className="text-sm">• <strong>+ gerund</strong> = quit an activity</p>
                  <p className="text-sm text-muted-foreground ml-4">He stopped smoking (quit completely)</p>
                  <p className="text-sm">• <strong>+ infinitive</strong> = stop in order to</p>
                  <p className="text-sm text-muted-foreground ml-4">He stopped to smoke (paused to have one)</p>
                </div>

                <div className="border-l-4 border-primary pl-4 space-y-2">
                  <h4 className="font-semibold">try</h4>
                  <p className="text-sm">• <strong>+ gerund</strong> = experiment</p>
                  <p className="text-sm text-muted-foreground ml-4">Try eating less sugar (experiment with it)</p>
                  <p className="text-sm">• <strong>+ infinitive</strong> = attempt</p>
                  <p className="text-sm text-muted-foreground ml-4">I tried to open the door (attempted)</p>
                </div>

                <div className="border-l-4 border-secondary pl-4 space-y-2">
                  <h4 className="font-semibold">go on</h4>
                  <p className="text-sm">• <strong>+ gerund</strong> = continue same activity</p>
                  <p className="text-sm text-muted-foreground ml-4">He went on talking (continued)</p>
                  <p className="text-sm">• <strong>+ infinitive</strong> = do next</p>
                  <p className="text-sm text-muted-foreground ml-4">He went on to study law (next step)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Reference;
