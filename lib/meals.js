import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import fs from 'node:fs';

const db = sql('meals.db');

export async function getMeals() {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // throw new Error('Loading meals failed');
    return db.prepare('SELECT * FROM meals').all();
}

export function getMeal(slug) {
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

export async function saveMeal(meal) {
    // getting the slug by using slugify on the meal title
    meal.slug = slugify(meal.title, {lower: true});
    // cleaning the instructions and making safe from cross site scripting
    // attacks using xss
    meal.instructions = xss(meal.instructions);

    // creating a filename for the image now
    const extension = meal.image.name.split('.').pop();
    const filename = `${meal.slug}.${extension}`

    // prepping to store the image in the public/images folder
    const stream = fs.createWriteStream(`public/images/${filename}`)
    const bufferedImage = await meal.image.arrayBuffer();
    //writing the image to the file
    stream.write(Buffer.from(bufferedImage), (error) => {
        if (error) {
            throw new Error('Saving image failed!')
        }
    });
    // overriding the image object with the path to store in the db rather
    // than the file (this was just written to the public folder above)
    meal.image = `/images/${filename}`

    db.prepare(`
        INSERT INTO meals
        (title, summary, instructions, creator, creator_email, image, slug)
        VALUES (
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
        )
    `).run(meal)
}