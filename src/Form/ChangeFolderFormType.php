<?php

namespace App\Form;

use App\Entity\ProjectFolder;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class ChangeFolderFormType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('name')
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            // Убираем валидацию sumbit'a
            'validation_groups' => false,
            'csrf_field_name' => '_csrf_token',
            'csrf_token_id'   => 'change_folder_form',
            'data_class' => ProjectFolder::class,
        ]);
    }
}
