import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
    region: 'eu-north-1'
});
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
    meal.slug = slugify(meal.title, { lower: true });
    // cleaning the instructions and making safe from cross site scripting
    // attacks using xss
    meal.instructions = xss(meal.instructions);


    const extension = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}.${extension}`

    const bufferedImage = await meal.image.arrayBuffer();

    const bucket = process.env.AWS_S3_BUCKET

    s3.putObject({
        Bucket: bucket,
        Key: fileName,
        Body: Buffer.from(bufferedImage),
        ContentType: meal.image.type,
    });

    meal.image = fileName

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