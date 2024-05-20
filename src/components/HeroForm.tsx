import { FormEvent } from 'react';
import { Hero } from '../types/hero';
import { useMessages } from '../context/MessageContext';
import { useNavigate } from 'react-router-dom';

type Props = {
    hero?: Hero;
    setHero?: (hero: Hero) => void;
}

const apiUrl = import.meta.env.VITE_API_URL;

export default function HeroForm({ hero, setHero }: Props) {
    const { addMessage } = useMessages();
    const navigate = useNavigate();

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const url = hero ? `${apiUrl}/heroes/${hero.id}` : `${apiUrl}/heroes`;
        const method = hero ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method: method,
                body: JSON.stringify({ name: formData.get('name') })
            });

            if (!response.ok) throw new Error('Request failed: ' + response.statusText);

            const data = await response.json();
            const message = hero
                ? `Hero ${hero.name} updated to ${data.name}`
                : `Hero ${data.name} created`
            addMessage(message);
            hero && setHero
                ? setHero(data)
                : navigate(`/heroes/${data.id}`)
        } catch (error) {
            console.log(error);
            addMessage('Failed to update hero');
        }
    }

    return (
        <div className='mt-3'>
            <h2 className='text-2xl'>{hero ? 'Edit hero' : 'Create hero'}</h2>
            <form onSubmit={onSubmit}>
                <label>Hero name</label>
                <div className='flex gap-3'>
                    <input
                        type="text"
                        name='name'
                        placeholder='name'
                        className='border border-gray-300 rounded-lg p-2 w-1/4'
                        defaultValue={hero?.name || ''}
                    />
                    <button type='submit' className='btn'>
                        {hero ? 'Update' : 'Create'}
                    </button>
                </div>
            </form>
        </div>

    )
}