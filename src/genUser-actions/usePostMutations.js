import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useView } from "../components/viewContext";
import { useAuth } from "../genUser-sections/AuthContext";

const APIURL = import.meta.env.VITE_API_URL;

export function usePostMutations(PostData){
    const queryClient = useQueryClient();
    const { activeView } = useView();
    const { user } = useAuth();

    const queryKey = ['posts', activeView.type, user?.id];

    //MUTACION EDITAR
    const updateMutation = useMutation({
        mutationFn: async(postChanges) => {
            const hasChanges = postChanges.newTitle !== PostData?.titulo || 
                                postChanges.newContent !== PostData?.contenido;
            
            if(!hasChanges){
                alert('Sin cambios para guardar')
                return;
            }

            const response = await fetch(`${APIURL}/posts/update_post`,{
                method: 'PUT',
                headers: {'Content-type':'Application/json'},
                body: JSON.stringify({ 
                    newTitle: postChanges.newTitle,
                    newContent: postChanges.newContent,
                    idPost: PostData?.idPost,
                    idUser: user?.id
                })
            });    

            if(!response.ok) throw new Error('Error al Editar el Post');
            return response.json();
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        }      
    });

    //MUTACION LIKE
    const likeMutation = useMutation({
        mutationFn: async (idPost) => {
            const response = await fetch(`${APIURL}/posts/like_post/${idPost}`, { method:'GET' });
            if (!response.ok) throw new Error('Error al procesar el like');
            return response.json();
        },
        onMutate: async(idPost) => {    
            await queryClient.cancelQueries({ queryKey });
            const previusPosts = queryClient.getQueryData(queryKey);

            //Actualizar Cache
            queryClient.setQueryData(queryKey, (oldData) => 
                oldData?.map((post) => 
                    post.idPost === idPost ? { ...post, likes: post.likes + 1 } : post)             
                );
            return { previusPosts };
        },
    
        onError: (err, idPost, context) => {
            if (context?.previousPosts) queryClient.setQueryData(queryKey, context.previousPosts);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        }      
    });


    //MUTACION BORRAR
    const deleteMutation= useMutation({
        mutationFn: async ([postId, stringfiles]) => {
            if(!confirm('Borras este post?')) return; 

            const response = await fetch(`${APIURL}/posts/erase_post`, { 
                method: 'DELETE',
                headers: {'Content-Type': 'Application/json'},
                body: JSON.stringify({postTarget: postId, stringTarget: stringfiles})
            });

            if(!response.ok) throw new Error('Error al borrar post'); 
            return response.json();
        },

        onMutate: async(idPost) => {
            await queryClient.cancelQueries({ queryKey });
            const previousPosts = queryClient.getQueryData(queryKey);
            queryClient.setQueryData(queryKey, (old) => 
                old ? old.filter(post => post.idPost !== idPost) : []);

            return { previousPosts };
        },

        onError: (err, idPost, context) => {
            // Si el backend falla, restauramos el post eliminado
            queryClient.setQueryData(queryKey, context.previousPosts);
            alert("No se pudo eliminar el post. Intentelo de nuevo.");
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        }
    });
    
    return { updateMutation, likeMutation, deleteMutation }
}