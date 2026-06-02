import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useView } from "../components/viewContext";
import { useAuth } from "../genUser-sections/AuthContext";

const APIURL = import.meta.env.VITE_API_URL;

export function useCommentMutations(CommentData){
    const { activeView } = useView();
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const queryKey = ['posts', activeView.type, user?.id];
 
    //EDIT
    const updateMutation = useMutation({
        mutationFn: async([newContent, idPost, idComment]) => {
            const hasChanges = newContent !== CommentData?.contenido;
            
            if(!hasChanges){
                alert('Sin cambios para guardar')
                return;
            }

            const response = await fetch(`${APIURL}/comments/edit_comment`,{
                method: 'PUT',
                headers: {'Content-type':'Application/json'},
                body: JSON.stringify({ 
                    newContent: newContent,
                    commentTarget: idComment,
                    postOrigin: idPost,
                    idUser: user?.id
                })
            });    

            if(!response.ok) throw new Error('Error al Editar el Comentario');
            return response.json();
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey });
        }      
    });
    

    //DELETE
    const deleteMutation = useMutation({
        mutationFn: async([idComment, idPost, idUser, stringfiles])=> {
            if(!confirm('¿Borras tu comentario?')){ return; }

            const response = await fetch(`${APIURL}/comments/erase_comment`, {
                method: 'DELETE',
                headers: {'Content-Type':'Application/json'},
                body: JSON.stringify({ idComment: idComment, idPost:idPost, 
                    idUsuario:idUser, stringTarget: stringfiles })
            });

            if(!response.ok) throw new Error('Algo salio mal (Comentario)')
            
            return response.json();
        },
        
        onSuccess: async() => {
            queryClient.invalidateQueries({ queryKey });
        },

        enabled: !!user?.id
    });

    return { updateMutation, deleteMutation }

}