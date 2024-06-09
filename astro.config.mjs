import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from "astro-icon";
import partytown from '@astrojs/partytown'



import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap(), icon(), partytown({
		config: {
		  forward: ["dataLayer.push"],
		},
	}),],
});
