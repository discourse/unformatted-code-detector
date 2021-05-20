export const falsePositives = [
  // https://meta.discourse.org/t/unformatted-code-detector-theme-component/112773/28
  `That's Japanese. ;)

Funny bug though.`,
  // https://meta.discourse.org/t/unformatted-code-detector-theme-component/112773/34
  `[quote="mbauman, post:1, topic:186896"]
I also just changed discobot’s text a bit as an experiment on our site to see if a slightly different wording helps lower the volume.
[/quote]

It's still early for our relatively small site but this is looking promising.  In the month prior to changing this, 18 folks did that tutorial step and 4 flagged it wrong.  In the month+ since 17 have done that step and 0 got it wrong.  The new text adds a few more details about why you might flag a post but I'm guessing it's the very small change to the final sentence that's doing most of the work:

> We like our discussions friendly, and we need your help to [keep things civilized](%{guidelines_url}). If you see a problem, please flag to privately let the author, or [our helpful staff](%{about_url}), know about it.  There are many reasons you might want to flag a post ranging from an innocuous thread-splitting suggestion to a clear-cut standards violation.  If you select "something else," you'll start a private message discussion chain with the moderators in which you can ask further questions.
>
> > :imp: I wrote something nasty here
>
> Go ahead and **flag this post** <img src="/plugins/discourse-narrative-bot/images/font-awesome-flag.png" width="16" height="16"> and select **inappropriate** as the reason!`,
];

export const falseNegatives = [];
