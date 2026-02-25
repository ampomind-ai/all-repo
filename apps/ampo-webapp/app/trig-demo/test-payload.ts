import { Engine } from '@scriblmotion/core';
import { SVGRenderer } from '@scriblmotion/svg';
import { summationLessonPayload } from './summation-lesson';

async function test() {
    try {
        console.log("Loading engine...");
        const renderer = new SVGRenderer();
        const engine = new Engine({
            container: document.createElement('div'),
            renderer,
            autoPlay: true
        });

        console.log("Loading summation payload...");
        await engine.load(summationLessonPayload);
        console.log("Successfully loaded. Entity Count:", engine.getEntities().length);
    } catch (err) {
        console.error("Failed to load engine:", err);
    }
}

test();
